import numpy as np
import pylab as plt


x = np.linspace(0,3, 200)

plt.figure(figsize=(5.5, 3.5))
plt.plot(x, np.sqrt(x), color='black')
plt.plot(x, np.sqrt(1.5)/1.5*x, color='black', linestyle='dashed')
plt.axvline(1.5, color='grey', alpha=0.5, linestyle='dotted')
plt.xlim(0, 3.2)
plt.ylim(0, 2)
plt.xticks([1.5], [r'$k^*$'])
plt.yticks([])
plt.gca().spines[['right', 'top', 'left', 'bottom']].set_visible(False)
# Annotations
plt.gca().annotate(r"$sf(k)$", xy=(3, 1.8), xytext=(3, 1.8))
plt.gca().annotate(r"$(n+\delta)k$", xy=(2.5, 2), xytext=(2.5, 2))
# plt.gca().annotate(r'$sf(k)>(n+\delta)k$', xy=(0.75, 0.1), xytext=(0.5, 0.1))
# plt.gca().annotate(r'$sf(k)<(n+\delta)k$', xy=(0.75, 0.1), xytext=(2, 0.1))
plt.gca().annotate(r'$\dot{k}>0$', xy=(0.75, 0.1), xytext=(0.5, 0.1))
plt.gca().annotate(r'$\dot{k}<0$', xy=(0.75, 0.1), xytext=(2, 0.1))

# Draw axis
plt.gca().annotate("", xy=(3.2, 0), xytext=(-.008, 0), arrowprops=dict(arrowstyle="-|>", lw=0.5, color='black'))
plt.gca().annotate("", xy=(0, 2), xytext=(0, -.008), arrowprops=dict(arrowstyle="-|>", lw=0.5, color='black'))
for k in np.linspace(0,1.5, 15)[::-1]:
    plt.gca().annotate("", xy=(k, 0), xytext=(0, 0),
                      arrowprops=dict(arrowstyle="->"))
    plt.gca().annotate("", xy=(3-k, 0), xytext=(3, 0),
                      arrowprops=dict(arrowstyle="->"))
plt.tight_layout()
plt.savefig("Teaching/MacroModelling/solow_chart.svg", transparent=True)
plt.show()




