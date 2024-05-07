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
                 label='GDP', color='k', **kwargs)
plot_periodogram(hpfilter(np.log(unrate), 1600)[0].values, 
                 label='Unemployment', **kwargs)

plt.xlabel('Years')
plt.ylim(0,1.1)
plt.yticks([])
plt.legend(loc='upper left', bbox_to_anchor=[0,0,0,1.1], frameon=False, ncol=2)
plt.tight_layout(rect=(0,0,1,0.975))
plt.savefig("Teaching/MacroModelling/BC_periodogram.svg", transparent=True)
plt.show()
plt.close()








