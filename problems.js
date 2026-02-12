/* dailystats – problems data (one problem per day per month) */

(function () {
  "use strict";

  const PROBLEMS_FEBRUARY = [
    { id: "01", title: "Mean and variance of a discrete variable", statement: `A discrete r.v. $X$ has pmf: $P(X=0)=0.2$, $P(X=1)=0.5$, $P(X=2)=0.3$. Find $\\mathbb{E}[X]$ and $\\mathrm{Var}(X)$.`, hint: `Use $\\mathbb{E}[X]=\\sum_x x\\,P(X=x)$ and $\\mathrm{Var}(X)=\\mathbb{E}[X^2]-(\\mathbb{E}[X])^2$.`, solution: `$\\mathbb{E}[X]=1.1$, $\\mathbb{E}[X^2]=1.7$, $\\mathrm{Var}(X)=0.49$.` },
    { id: "02", title: "Probability with standard Normal", statement: `Let $X\\sim\\mathcal{N}(50,10^2)$. Find $P(40\\le X\\le 65)$.`, hint: `Standardize: $Z=(X-\\mu)/\\sigma$ and use $\\Phi$.`, solution: `$P(-1\\le Z\\le 1.5)=\\Phi(1.5)-\\Phi(-1)\\approx 0.7745$.` },
    { id: "03", title: "Confidence interval for mean (σ known)", statement: `A sample of $n=36$ from a normal population has $\\bar x=12.4$. Known $\\sigma=3$. Build a 95% CI for $\\mu$.`, hint: `For 95%: $z_{0.975}\\approx 1.96$. Use $\\bar x \\pm z\\,\\sigma/\\sqrt{n}$.`, solution: `SE$=0.5$, margin$=0.98$, CI: $(11.42,\\,13.38)$.` },
    { id: "04", title: "Hypothesis test for proportion", statement: `In a survey, $n=200$ and $x=118$ said "yes". Test $H_0:p=0.5$ vs $H_1:p\\ne 0.5$ at 5%.`, hint: `Use $z=(\\hat p-p_0)/\\sqrt{p_0(1-p_0)/n}$ with $\\hat p=x/n$.`, solution: `$\\hat p=0.59$, $z\\approx 2.55>1.96$, reject $H_0$.` },
    { id: "05", title: "Pearson correlation", statement: `Data $(1,2),(2,3),(3,5),(4,4),(5,6)$. Find Pearson's $r$.`, hint: `$r=\\frac{\\sum (x_i-\\bar x)(y_i-\\bar y)}{\\sqrt{\\sum(x_i-\\bar x)^2\\sum(y_i-\\bar y)^2}}$.`, solution: `$\\bar x=3$, $\\bar y=4$, $r=0.9$.` },
    { id: "06", title: "Binomial distribution", statement: `$X\\sim\\mathrm{Bin}(n=10,p=0.3)$. Find $P(X\\ge 4)$.`, hint: `$P(X\\ge 4)=1-P(X\\le 3)$ with $P(X=k)=\\binom{10}{k}0.3^k0.7^{10-k}$.`, solution: `$P(X\\ge 4)=1-\\sum_{k=0}^{3}\\binom{10}{k}0.3^k0.7^{10-k}$.` },
    { id: "07", title: "MLE for Bernoulli", statement: `Observe i.i.d. $X_1,\\ldots,X_n\\sim\\mathrm{Bernoulli}(p)$. Show the MLE of $p$ is $\\hat p=\\bar X$.`, hint: `Write $L(p)=\\prod p^{x_i}(1-p)^{1-x_i}$ and maximize $\\log L(p)$.`, solution: `$\\hat p=\\frac{1}{n}\\sum X_i=\\bar X$.` },
    { id: "08", title: "Law of total probability", statement: `Events $A,B$ with $P(B)=0.3$, $P(A|B)=0.6$, $P(A|B^c)=0.2$. Find $P(A)$.`, hint: `$P(A)=P(A|B)P(B)+P(A|B^c)P(B^c)$.`, solution: `$P(A)=0.6(0.3)+0.2(0.7)=0.32$.` },
    { id: "09", title: "Bayes' rule", statement: `$P(D)=0.01$, $P(+|D)=0.95$, $P(+|D^c)=0.05$. Given a positive test, find $P(D|+)$.`, hint: `Bayes: $P(D|+)=P(+|D)P(D)/P(+)$.`, solution: `$P(+)=0.01(0.95)+0.99(0.05)=0.059$; $P(D|+)\\approx 0.161$.` },
    { id: "10", title: "Expected value of a function", statement: `$X$ has pmf $P(X=k)=1/4$ for $k=1,2,3,4$. Find $\\mathbb{E}[X^2]$.`, hint: `$\\mathbb{E}[g(X)]=\\sum_k g(k)P(X=k)$.`, solution: `$\\mathbb{E}[X^2]=(1+4+9+16)/4=7.5$.` },
    { id: "11", title: "Variance by definition", statement: `$X$ takes values $-1,0,1$ with $P(X=0)=0.5$ and $P(X=1)=P(X=-1)=0.25$. Find $\\mathrm{Var}(X)$.`, hint: `$\\mathrm{Var}(X)=\\mathbb{E}[X^2]-(\\mathbb{E}[X])^2$.`, solution: `$\\mathbb{E}[X]=0$, $\\mathbb{E}[X^2]=0.5$, $\\mathrm{Var}(X)=0.5$.` },
    { id: "12", title: "Chebyshev's inequality", statement: `$X$ has mean $10$ and variance $4$. Bound $P(|X-10|\\ge 4)$ using Chebyshev.`, hint: `$P(|X-\\mu|\\ge k\\sigma)\\le 1/k^2$.`, solution: `$k=4/2=2$, so $P(|X-10|\\ge 4)\\le 1/4$.` },
    { id: "13", title: "Poisson approximation", statement: `$X\\sim\\mathrm{Bin}(n=100,p=0.02)$. Approximate $P(X=2)$ by Poisson.`, hint: `$\\lambda=np=2$; $P(X=k)\\approx e^{-\\lambda}\\lambda^k/k!$.`, solution: `$P(X=2)\\approx e^{-2}2^2/2!=2e^{-2}\\approx 0.271$.` },
    { id: "14", title: "Exponential and memorylessness", statement: `$X\\sim\\mathrm{Exp}(\\lambda)$. Show $P(X>s+t\\mid X>s)=P(X>t)$.`, hint: `Use $P(X>x)=e^{-\\lambda x}$ for $x>0$.`, solution: `$P(X>s+t|X>s)=e^{-\\lambda t}=P(X>t)$.` },
    { id: "15", title: "Normal quantile", statement: `If $Z\\sim\\mathcal{N}(0,1)$, find $c$ such that $P(Z\\le c)=0.9$.`, hint: `$c=\\Phi^{-1}(0.9)$; use tables or $c\\approx 1.28$.`, solution: `$c\\approx 1.2816$.` },
    { id: "16", title: "Sample variance unbiased", statement: `For i.i.d. $X_1,\\ldots,X_n$ with variance $\\sigma^2$, show $\\mathbb{E}[S^2]=\\sigma^2$ for $S^2=\\frac{1}{n-1}\\sum(X_i-\\bar X)^2$.`, hint: `Expand $\\sum(X_i-\\bar X)^2$ and use $\\mathbb{E}[X_i^2]=\\sigma^2+\\mu^2$.`, solution: `$\\mathbb{E}[S^2]=\\sigma^2$ (standard derivation).` },
    { id: "17", title: "CLT application", statement: `$X_i$ i.i.d. with $\\mu=5$, $\\sigma^2=9$, $n=36$. Approximate $P(4.5<\\bar X<5.5)$.`, hint: `$\\bar X\\approx\\mathcal{N}(\\mu,\\sigma^2/n)$; standardize.`, solution: `$P(-0.5<Z<0.5)\\approx 0.383$.` },
    { id: "18", title: "t-interval for mean", statement: `$n=16$, $\\bar x=20$, $s=4$. Build a 95% t-interval for $\\mu$ (unknown variance).`, hint: `$t_{0.025,15}\\approx 2.13$; interval $\\bar x\\pm t\\,s/\\sqrt{n}$.`, solution: `$20\\pm 2.13(1)=(18.87,\\,21.13)$.` },
    { id: "19", title: "Chi-square for variance", statement: `Normal sample: $n=10$, $s^2=5$. Test $H_0:\\sigma^2=4$ vs $H_1:\\sigma^2>4$ at 5%.`, hint: `$(n-1)S^2/\\sigma_0^2\\sim\\chi^2_{n-1}$ under $H_0$.`, solution: `$9(5)/4=11.25$; compare to $\\chi^2_{9,0.95}\\approx 16.92$; do not reject.` },
    { id: "20", title: "Two-sample t-test", statement: `Group A: $n_1=12$, $\\bar x_1=8$, $s_1=2$. Group B: $n_2=10$, $\\bar x_2=6$, $s_2=1.5$. Test $H_0:\\mu_1=\\mu_2$ at 5%.`, hint: `Use pooled or Welch t-statistic.`, solution: `Pooled $t\\approx 2.7$, reject $H_0$ if $|t|>t_{0.025,\\mathrm{df}}$.` },
    { id: "21", title: "ANOVA F-statistic", statement: `Three groups, $n_i=5$ each, $\\bar x_1=3$, $\\bar x_2=5$, $\\bar x_3=4$, $\\bar x=4$. SSB=20, SSW=24. Find $F$.`, hint: `$F=\\mathrm{MSB}/\\mathrm{MSW}$ with $\\mathrm{df}_1=2$, $\\mathrm{df}_2=12$.`, solution: `MSB=10, MSW=2, $F=5$.` },
    { id: "22", title: "Simple linear regression", statement: `Data: $(1,2),(2,4),(3,5)$. Fit $y=\\beta_0+\\beta_1 x$ by least squares. Find $\\hat\\beta_1$.`, hint: `$\\hat\\beta_1=\\frac{\\sum(x_i-\\bar x)(y_i-\\bar y)}{\\sum(x_i-\\bar x)^2}$.`, solution: `$\\bar x=2$, $\\bar y=11/3$; $\\hat\\beta_1=1.5$.` },
    { id: "23", title: "R-squared", statement: `In a regression, SST=100, SSE=25. Find $R^2$.`, hint: `$R^2=1-\\mathrm{SSE}/\\mathrm{SST}$.`, solution: `$R^2=1-25/100=0.75$.` },
    { id: "24", title: "Residual sum of squares", statement: `Fitted line $\\hat y=1+2x$. Data points $(1,4),(2,5),(3,10)$. Find SSE.`, hint: `SSE$=\\sum(y_i-\\hat y_i)^2$.`, solution: `Residuals $1,0,-3$; SSE$=1+0+9=10$.` },
    { id: "25", title: "Covariance and correlation", statement: `$\\mathrm{Cov}(X,Y)=2$, $\\sigma_X=2$, $\\sigma_Y=3$. Find correlation $\\rho$.`, hint: `$\\rho=\\mathrm{Cov}(X,Y)/(\\sigma_X\\sigma_Y)$.`, solution: `$\\rho=2/(2\\cdot 3)=1/3$.` },
    { id: "26", title: "Independence and expectation", statement: `If $X$ and $Y$ are independent with $\\mathbb{E}[X]=1$, $\\mathbb{E}[Y]=2$, find $\\mathbb{E}[XY]$.`, hint: `For independent r.v.s, $\\mathbb{E}[XY]=\\mathbb{E}[X]\\mathbb{E}[Y]$.`, solution: `$\\mathbb{E}[XY]=1\\cdot 2=2$.` },
    { id: "27", title: "CDF from PDF", statement: `$X$ has pdf $f(x)=2x$ for $0<x<1$, zero elsewhere. Find $F(x)$ for $0<x<1$.`, hint: `$F(x)=\\int_{-\\infty}^x f(t)\\,\\mathrm{d}t$.`, solution: `$F(x)=x^2$ for $x\\in(0,1)$.` },
    { id: "28", title: "Median of distribution", statement: `$X$ has pdf $f(x)=e^{-x}$ for $x>0$. Find the median.`, hint: `Median $m$ satisfies $F(m)=0.5$.`, solution: `$1-e^{-m}=0.5$ so $m=\\ln 2$.` },
    { id: "29", title: "Moment generating function", statement: `$X\\sim\\mathrm{Exp}(\\lambda)$. Find $M_X(t)=\\mathbb{E}[e^{tX}]$ for $t<\\lambda$.`, hint: `$M_X(t)=\\int_0^\\infty e^{tx}\\lambda e^{-\\lambda x}\\,\\mathrm{d}x$.`, solution: `$M_X(t)=\\lambda/(\\lambda-t)$ for $t<\\lambda$.` },
    { id: "30", title: "Order statistics", statement: `$X_1,X_2,X_3$ i.i.d. $\\mathrm{Uniform}(0,1)$. Find the pdf of $X_{(2)}$ (the median order statistic).`, hint: `For $n=3$, $X_{(2)}$ has a known Beta distribution.`, solution: `$X_{(2)}\\sim\\mathrm{Beta}(2,2)$; $f(x)=6x(1-x)$ on $(0,1)$.` }
  ];

  const PROBLEMS_BY_MONTH = {
    "2025-02": PROBLEMS_FEBRUARY
  };

  window.PROBLEMS_FEBRUARY = PROBLEMS_FEBRUARY;
  window.PROBLEMS_BY_MONTH = PROBLEMS_BY_MONTH;
})();
