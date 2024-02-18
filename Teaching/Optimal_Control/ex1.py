"""  Created on 16/02/2024::
------------- temp.py -------------

**Authors**: L. Mingarelli
"""

from scipy.optimize import fsolve
import numpy as np, pylab as plt

kwargs = dict(color='k', linewidth=1, alpha=0.25)
δ = 0.001

t = np.arange(0, 100, δ)



# β = 1
### α≥0, u = 1
# x2 = -t
# x1 = t**2/2
# plt.plot(x1, x2, **kwargs)

### α<0, u = -1
for t0 in [0,2,4,6,8,10]:
    x2 = (t-2*t0)
    x1 = 2*t0*t - t**2/2 - t0**2
    plt.plot(x1[t>=t0], x2[t>=t0], **kwargs)

# β = -1
# x2 = t
# x1 = -t**2/2
# plt.plot(x1, x2, **kwargs)
###
for t0 in [0,2,4,6,8,10]:
    x2 = -(t-2*t0)
    x1 = -2*t0*t + t**2/2 + t0**2
    plt.plot(x1[t>=t0], x2[t>=t0], **kwargs)


def plot_trajectory(x0, y0):
    plt.scatter(x=[x0], y=[y0], color='r')

    def equations(s=1):
        if s==1:
            def f(vars):
                t, t0 = vars
                eq1 = y0 + (t - 2 * t0)
                eq2 = x0 + (2 * t0 * t - t ** 2 / 2 - t0 ** 2)
                return [eq1, eq2]
        else:
            def f(vars):
                t, t0 = vars
                eq1 = y0 - (t - 2 * t0)
                eq2 = x0 - (2 * t0 * t - t ** 2 / 2 - t0 ** 2)
                return [eq1, eq2]
        return f

    if (x0>0 and -np.sqrt(2*x0)<y0) or (x0<=0 and np.sqrt(-2*x0)<y0):
        t_, t0 = fsolve(func=equations(s=2), x0=(100, 100))
        t0 = np.sqrt(y0**2/2+x0)

        def plot_t1(t_, t0, color=None):
            kwargs = {} if color is None else dict(color=color)
            _t = np.arange(0, t_, δ)

            x2 = (_t - 2 * t0)
            x1 = 2 * t0 * _t - _t ** 2 / 2 - t0 ** 2
            idx = (_t >= t0)
            return plt.plot(x1[idx], x2[idx], **kwargs)

        def plot_t2(t_, t0, color=None):
            kwargs = {} if color is None else dict(color=color)
            _t = np.arange(0, t0, δ)

            x2 = -_t
            x1 = +_t ** 2 / 2

            return plt.plot(x1, x2, **kwargs)

        p = plot_t1(t_=t_, t0=t0)
        plot_t2(t_=t_, t0=t0, color=p[-1].get_color())

    elif (x0<=0 and np.sqrt(-2*x0)>y0) or (x0>0 and -np.sqrt(2*x0)>y0):
        t_, t0 = fsolve(func=equations(1), x0=(100, 100))
        t0 = np.sqrt(y0**2/2-x0)

        def plot_t1(t_, t0, color=None):
            kwargs = {} if color is None else dict(color=color)
            _t = np.arange(0, t_, δ)

            x2 = -(_t - 2 * t0)
            x1 = -2 * t0 * _t + _t ** 2 / 2 + t0 ** 2

            idx = (_t >= t0)
            return plt.plot(x1[idx], x2[idx], **kwargs)
        def plot_t2(t_, t0, color=None):
            kwargs = {} if color is None else dict(color=color)
            _t = np.arange(0, t0, δ)

            x2 = _t
            x1 = -_t ** 2 / 2

            return plt.plot(x1, x2, **kwargs)

        p = plot_t1(t_=t_, t0=t0)
        plot_t2(t_=t_, t0=t0, color=p[-1].get_color())

        print(t_, t0)


for x0,y0 in (
              (-35,-5),
              (0,-6),
              (10,-8),
              (-20,8),
              (20, -2),
              ):
    plot_trajectory(x0=x0, y0=y0)

plt.xlim(-50, 50); plt.ylim(-10, 10)
plt.show()




