from fredapi import Fred
import pandas as pd
from Teaching.MacroModelling.business_cycle.utils import *

import seaborn as sns
%config InlineBackend.figure_format = 'svg'
sns.set(rc={'axes.facecolor':'#DCDCDC' ,'figure.facecolor':'#DCDCDC'})



fred = Fred(api_key='6d0d2962ffaa5bf7eb12a6ac666d4ff9')








unrate = fred.get_series('UNRATE')
unrate.index = pd.to_datetime(unrate.index)
unrate = unrate[unrate.index<'2016-01-01']

x0 = unrate.values
sf, ssd = smooth_periodogram(x0)

plot_periodogram(x0)
plt.savefig("Teaching/MacroModelling/BC_periodogram.svg", transparent=True)
plt.show()








