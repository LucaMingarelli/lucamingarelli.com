

import pandas as pd
import numpy as np
import pylab as plt
from scipy.signal import periodogram

nkr = 13
_TICKS = np.array([2, 4, 6, 12, 24, 32, 40, 50, 60, 80, 128])


def hamming_smooth(y, box_pts):
    # Hamming Kernel smoother
    n = np.arange(box_pts)
    box = 0.54 - 0.46 * np.cos(2 * np.pi * n / (box_pts - 1))
    box = box / sum(box)

    y_smooth = np.convolve(y, box, mode='same')
    return y_smooth


def smooth_interp(x, y, k=nkr, _n=200, _ns=2):
    x_new = np.linspace(min(x), max(x), k * _n)
    y_new = np.interp(x_new, x, y)
    y_new = hamming_smooth(y_new, nkr * _ns)
    return x_new, y_new

def smooth_periodogram(x, window='hamming', scaling='density', detrend='linear'):
    freq, spectral_density = periodogram(x, window=window, scaling=scaling, detrend=detrend)
    smooth_freq, smooth_spectral_density = smooth_interp(freq, spectral_density)
    return smooth_freq, smooth_spectral_density

def plot_periodogram(x, smooth=True, ticks=_TICKS[1:-2], window='hamming',
                     scaling='density', detrend='linear',
                     normalise=False, ticks_multiplier=4,
                     k=nkr, _n=200, _ns=2, label=None, color=None):
    freq, spectral_density = periodogram(x, window=window, scaling=scaling, detrend=detrend)
    if smooth:
        freq, spectral_density = smooth_interp(freq, spectral_density, k=k, _n=_n, _ns=_ns)

    freq, spectral_density = freq[freq>0], spectral_density[freq>0]
    if normalise:
        spectral_density /= spectral_density.max()
    x, y = 1 / freq, spectral_density
    mask = (x>ticks[0] * 4)&(x<ticks[-1]*ticks_multiplier)
    x, y = x[mask], y[mask]
    line = plt.plot(x, y, color=color, label=label)
    line[0].set_clip_on(False)
    plt.xscale('log')
    ticks = np.array(ticks)
    plt.xticks(ticks * ticks_multiplier, ticks)
    plt.xlim(ticks[0] * 4, ticks[-1]*ticks_multiplier)
    plt.ylim(0, spectral_density[(1 / freq) < ticks_multiplier * ticks[-1]].max())



















