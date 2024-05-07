from fredapi import Fred
import pandas as pd, numpy as np
from Teaching.MacroModelling.business_cycle.utils import *
from statsmodels.tsa.filters.hp_filter import hpfilter

import seaborn as sns
%config InlineBackend.figure_format = 'svg'
sns.set(rc={'axes.facecolor':'#DCDCDC' ,'figure.facecolor':'#DCDCDC'})


fred = Fred(api_key='6d0d2962ffaa5bf7eb12a6ac666d4ff9')



gdp = fred.get_series('GDP').dropna()
gdp.index = pd.to_datetime(gdp.index)
# gdp = gdp[gdp.index<'2016-01-01']
gdp = hpfilter(np.log(gdp), 1600)[0]

unrate = fred.get_series('UNRATE')
unrate.index = pd.to_datetime(unrate.index)
# unrate = unrate[unrate.index<'2016-01-01']



sf, ssd = smooth_periodogram(unrate.values)

plot_periodogram(unrate.values, normalise=True)
plot_periodogram(gdp.values, normalise=True)
plt.savefig("Teaching/MacroModelling/BC_periodogram.svg", transparent=True)
plt.show()
plt.close()








