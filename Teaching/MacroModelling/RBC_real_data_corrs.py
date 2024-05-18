from fredapi import Fred
import pandas as pd, numpy as np
from statsmodels.tsa.filters.hp_filter import hpfilter

import seaborn as sns
%config InlineBackend.figure_format = 'svg'
sns.set(rc={'axes.facecolor':'#DCDCDC' ,'figure.facecolor':'#DCDCDC'})

fred = Fred(api_key='6d0d2962ffaa5bf7eb12a6ac666d4ff9')



gdp = fred.get_series('GDP').dropna()
gdp.index = pd.to_datetime(gdp.index)
# gdp = gdp[gdp.index<'2016-01-01']
gdp_f = hpfilter(np.log(gdp), 1600)[0]


######### 
dff = fred.get_series('DFF')
dff.index = pd.to_datetime(dff.index)
dff = dff[dff.index.isin(gdp.index)]
dff_f = hpfilter(np.log(dff), 1600)[0]

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

############ STDs

print(dff_f.std()*100)
print(gdp_f.std()*100)
print(pce_f.std()*100)
print(wage_f.std()*100)
print(hw_f.std()*100)
print(tfp_f.std()*100)

def corr(x, y):
    jf = pd.concat([x, y], axis=1).dropna()
    return np.corrcoef(jf.iloc[:,0], jf.iloc[:,1])


corr(x=gdp_f, y=dff_f)[0][1]
corr(x=gdp_f, y=pce_f)[0][1]
corr(x=gdp_f, y=wage_f)[0][1]
corr(x=gdp_f, y=tfp_f)[0][1]
corr(x=pce_f, y=wage_f)[0][1]
corr(x=tfp_f, y=wage_f)[0][1]





