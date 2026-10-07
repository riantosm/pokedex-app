const SUPERSCRIPT: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

/** LaTeX satu ekspresi → teks biasa: `\frac{6x^3}{5} - 15x^2` → `6x³ ⁄ 5 − 15x²`. */
function plainExpression(latex: string): string {
  let s = latex;
  // Pecahan bersarang: ganti yang paling dalam dulu sampai habis.
  const frac = /\\frac\{([^{}]*)\}\{([^{}]*)\}/;
  while (frac.test(s)) {
    s = s.replace(frac, (_, a: string, b: string) => {
      const num = a.trim();
      const den = b.trim();
      const wrap = (x: string) => (/^[\w^]+$/.test(x) ? x : `(${x})`);
      return `${wrap(num)} ⁄ ${wrap(den)}`;
    });
  }
  return s
    .replace(/\\left\s*\\lfloor/g, '⌊')
    .replace(/\\right\s*\\rfloor/g, '⌋')
    .replace(/\\left\s*\(/g, '(')
    .replace(/\\right\s*\)/g, ')')
    .replace(/\\bmod/g, 'mod')
    .replace(/\\leq/g, '≤')
    .replace(/\\text\{if \}/g, 'jika ')
    .replace(/\^(\d)/g, (_, d: string) => SUPERSCRIPT[d])
    .replace(/ - /g, ' − ')
    .replace(/\s+/g, ' ')
    .replace(/⌊\s+/g, '⌊')
    .replace(/\s+⌋/g, '⌋')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim();
}

export interface FormulaLine {
  expression: string;
  /** Syarat untuk rumus bertingkat, mis. `jika x ≤ 50`. */
  condition?: string;
}

/**
 * Rumus `growth_rate.formula` (LaTeX) → baris yang bisa ditampilkan.
 * Rumus bertingkat (`\begin{cases}`, mis. Erratic) dipecah per syarat.
 */
export function formatGrowthFormula(latex: string): FormulaLine[] {
  const cases = latex.match(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/);
  if (!cases) {
    return [{ expression: plainExpression(latex) }];
  }
  return cases[1]
    .split('\\\\')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [expr, cond] = line.split('&');
      return {
        expression: plainExpression(expr.replace(/,\s*$/, '')),
        condition: cond ? plainExpression(cond) : undefined,
      };
    });
}
