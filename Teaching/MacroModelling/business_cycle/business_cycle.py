"""  Created on 06/05/2024::
------------- nber_recessions.py -------------
 
**Authors**: L. Mingarelli
"""
from fredapi import Fred
fred = Fred(api_key='6d0d2962ffaa5bf7eb12a6ac666d4ff9')
import pylab as plt, numpy as np, pandas as pd
from statsmodels.tsa.filters.hp_filter import hpfilter

# import seaborn as sns
# %config InlineBackend.figure_format = 'svg'
# sns.set(rc={'axes.facecolor':'#DCDCDC' ,'figure.facecolor':'#DCDCDC'})


START_DATE = '1950-01-01'
recessions = fred.get_series('USRECDM')
recessions = recessions[recessions.index>START_DATE]


ITEMS = {'PCE': 'Consumption', # Personal Consumption Expenditures
         'GPDI': 'Investment', # Gross Private Domestic Investment
         'AHETPI': 'Wage per Hour', # Average Hourly Earnings of Production and Nonsupervisory Employees, Total Private
         'HOANBS': 'Hours worked', # Nonfarm Business Sector: Hours Worked for All Workers
         'TFP': 'TFP',
         'UNRATE': 'Unemployment (rhs)',
         # 'DFF': 'Federal Funds Rate',
         }
DATA = {}

for k,v in ({'GDP':''}|ITEMS).items():
    if k!='TFP':
        DATA[k] = fred.get_series(k)
        DATA[k] = DATA[k][DATA[k].index > START_DATE]
        DATA[k] = DATA[k][DATA[k].index.isin(DATA['GDP'].index)]
        if k != 'UNRATE':
            DATA[k] = hpfilter(np.log(DATA[k].dropna()), 1600)[0]
    else:
        DATA['TFP'] = pd.read_excel('https://www.frbsf.org/wp-content/uploads/quarterly_tfp.xlsx',
                                     sheet_name='quarterly', skiprows=1)
        DATA['TFP'] = DATA['TFP'][DATA['TFP'].date.str.contains(':Q').fillna(False)].set_index('date')['dtfp']
        DATA['TFP'].index = pd.to_datetime(DATA['TFP'].index.str.replace(':', ''))
        DATA['TFP'] = DATA['TFP'][DATA['TFP'].index.isin(DATA['GDP'].index)]
        DATA['TFP'] = hpfilter(DATA['TFP'].cumsum() / 250, 1600)[0]

item = 'PCE' ### Consumption, GDP, & Recessions
item = 'GPDI' ### Investment, GDP, & Recessions
item = 'TOTLQ' ### Wage, GDP, & Recessions
item = 'HOANBS' ### Hours Worked, GDP, & Recessions
item = 'UNRATE' ### Unemployment, GDP, & Recessions
item = 'TFP' ### TFP, GDP, & Recessions


# plt.figure(figsize=(8,3))
# plt.plot(DATA['GDP'].index, DATA['GDP'].values, color='k')
# plt.plot(DATA[item].index, DATA[item].values)
# plt.ylim(-0.2,0.2)
# recessions.plot.area(color='gray', alpha=0.2, linewidth=0, ax=plt.gca().twinx())
# plt.ylim(0,1)
# plt.yticks([])
# plt.show()




fig, axs = plt.subplots(nrows=3, ncols=2, figsize=(15,10),
                        sharex=True, sharey=True)

for n in range(6):
    ax = axs.flatten()[n]
    item = list(DATA.keys())[n+1]
    not_urate = item != 'UNRATE'
    ax.plot(DATA['GDP'].index, DATA['GDP'].values, color='k', label='GDP')
    ax2 = ax.twinx()
    (ax if not_urate else ax2).plot(DATA[item].index, DATA[item].values)
    ax.set_ylim(-0.2,0.2)
    ax.set_title(ITEMS[item])
    ax.set_yticks([-.2, -.1, 0,.1,.2])
    m = 1 if not_urate else DATA['UNRATE'].max()
    recession_line = (m*recessions).plot.area(color='gray', alpha=0.4, linewidth=0, ax=ax2, label='NBER Recessions')
    ax2.set_ylim(0, m)
    if not_urate:
        ax2.set_yticks([])
    else:
        ax2.grid(False)
h1, l1 = ax.get_legend_handles_labels()
h2, l2 = ax2.get_legend_handles_labels()
fig.legend(h1+h2, l1+l2, loc='upper left', frameon=False, ncol=2)
plt.tight_layout(rect=(0,0,1,0.975))
plt.savefig("Teaching/MacroModelling/BC.svg", transparent=True)
plt.show()



















