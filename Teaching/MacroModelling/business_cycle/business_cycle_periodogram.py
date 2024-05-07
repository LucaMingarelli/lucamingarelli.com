from fredapi import Fred
import pandas as pd, numpy as np
from Teaching.MacroModelling.business_cycle.utils import *
from Teaching.MacroModelling.business_cycle.utils import _TICKS
from statsmodels.tsa.filters.hp_filter import hpfilter

import seaborn as sns
%config InlineBackend.figure_format = 'svg'
sns.set(rc={'axes.facecolor':'#DCDCDC' ,'figure.facecolor':'#DCDCDC'})


fred = Fred(api_key='6d0d2962ffaa5bf7eb12a6ac666d4ff9')



gdp = fred.get_series('GDP').dropna()
gdp.index = pd.to_datetime(gdp.index)
# gdp = gdp[gdp.index<'2016-01-01']
gdp_f = hpfilter(np.log(gdp), 1600)[0]

unrate = fred.get_series('UNRATE')
unrate.index = pd.to_datetime(unrate.index)
unrate = unrate[unrate.index.isin(gdp.index)]
# unrate = unrate[unrate.index<'2016-01-01']
unrate_f = hpfilter(np.log(unrate), 1600)[0]



# sf, ssd = smooth_periodogram(unrate.values)


kwargs = dict(ticks=_TICKS[:5], normalise=True, ticks_multiplier=4,
              k=11, _n=600, _ns=20)
plot_periodogram(gdp_f.values, 
                 plot_kwargs=dict(label='GDP', color='k'), **kwargs)
plot_periodogram(hpfilter(np.log(unrate), 1600)[0].values, 
                 plot_kwargs=dict(label='Unemployment'), **kwargs)

plt.xlabel('Years')
plt.ylabel('Spectral density')
plt.ylim(0,1.1)
plt.yticks([])
plt.legend(loc='upper left', bbox_to_anchor=[0,0,0,1.1], frameon=False, ncol=2)
plt.tight_layout(rect=(0,0,1,0.975))
plt.savefig("Teaching/MacroModelling/BC_periodogram.svg", transparent=True)
plt.show()
plt.close()




######### 
pce = fred.get_series('PCE')
pce.index = pd.to_datetime(pce.index)
pce = pce[pce.index.isin(gdp.index)]
pce_f = hpfilter(np.log(pce), 1600)[0]

gpdi = fred.get_series('GPDI')
gpdi.index = pd.to_datetime(gpdi.index)
gpdi = gpdi[gpdi.index.isin(gdp.index)]
gpdi_f = hpfilter(np.log(gpdi), 1600)[0]

wage = fred.get_series('AHETPI')
wage.index = pd.to_datetime(wage.index)
wage = wage[wage.index.isin(gdp.index)]
wage_f = hpfilter(np.log(wage), 1600)[0]

hw = fred.get_series('HOANBS')
hw.index = pd.to_datetime(hw.index)
hw = hw[hw.index.isin(gdp.index)]
hw_f = hpfilter(np.log(hw), 1600)[0]

tfp = pd.read_excel('https://www.frbsf.org/wp-content/uploads/quarterly_tfp.xlsx',
                             sheet_name='quarterly', skiprows=1)
tfp = tfp[tfp.date.str.contains(':Q').fillna(False)].set_index('date')['dtfp']
tfp.index = pd.to_datetime(tfp.index.str.replace(':', ''))
tfp = tfp[tfp.index.isin(gdp.index)]
tfp_f = hpfilter(tfp.dropna().cumsum() / 250, 1600)[0]

############ MULTIPLE

kwargs = dict(ticks=_TICKS[:5], normalise=True, ticks_multiplier=4,
              k=11, _n=600, _ns=20)
plt.figure(figsize=(8,4))
plot_periodogram(gdp_f.values,
                 plot_kwargs=dict(label='GDP', color='k'), **kwargs)
plot_periodogram(wage_f.values,
                 plot_kwargs=dict(label='Others', color='k', linewidth=0.5, alpha=0.5), **kwargs)
for var in (pce_f, hw_f, gpdi_f, tfp_f,
            hpfilter(np.log(unrate), 1600)[0]):
    plot_periodogram(var.values,
                     plot_kwargs=dict(color='k', linewidth=0.5, alpha=0.5), **kwargs)
## ANNOTATIONS
ann_kwargs = dict(xycoords='data', textcoords='axes fraction', va='top', ha='left',
                  arrowprops=dict( arrowstyle='-', linewidth=0.5))
plt.annotate('TFP', xy=(28, 0.9), xytext=(0.53, .985), **ann_kwargs)
plt.annotate('Investment', xy=(27.5, 0.85), xytext=(0.7, .9), **ann_kwargs)
plt.annotate('Wage', xy=(40, 0.9), xytext=(0.7, .96), **ann_kwargs)
plt.annotate('Unemployment', xy=(39, 0.8), xytext=(0.75, 0.85), **ann_kwargs)
plt.annotate('Hours worked', xy=(37.5, 0.75), xytext=(0.75, 0.8), **ann_kwargs)
plt.annotate('Consumption', xy=(44, 0.17), xytext=(0.825, 0.25), **ann_kwargs)

plt.xlabel('Years')
plt.ylim(0,1.01)
plt.yticks([])
plt.legend(loc='upper left', bbox_to_anchor=[0,0,0,1.1], frameon=False, ncol=4)
plt.tight_layout(rect=(0,0,1,0.975))
plt.savefig("Teaching/MacroModelling/BC_periodogram_multi.svg", transparent=True)
plt.show()






