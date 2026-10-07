import { formatGrowthFormula } from '../formula';

describe('formatGrowthFormula', () => {
  it('rumus tunggal', () => {
    expect(formatGrowthFormula('x^3')).toEqual([{ expression: 'x³' }]);
    expect(formatGrowthFormula('\\frac{6x^3}{5} - 15x^2 + 100x - 140')).toEqual(
      [{ expression: '6x³ ⁄ 5 − 15x² + 100x − 140' }],
    );
  });

  it('rumus bertingkat (Erratic) dipecah per syarat, pecahan bersarang & lantai', () => {
    const latex = `\\begin{cases}
\\frac{ x^3 \\left( 100 - x \\right) }{50},    & \\text{if } x \\leq 50  \\\\
\\frac{ x^3 \\left( 1274 + (x \\bmod 3)^2 - 20 \\left\\lfloor \\frac{x}{3} \\right\\rfloor \\right) }{1000}, & \\text{if } 68 < x \\leq 98  \\\\
\\end{cases}`;
    const lines = formatGrowthFormula(latex);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toEqual({
      expression: '(x³ (100 − x)) ⁄ 50',
      condition: 'jika x ≤ 50',
    });
    expect(lines[1].expression).toBe(
      '(x³ (1274 + (x mod 3)² − 20 ⌊x ⁄ 3⌋)) ⁄ 1000',
    );
    expect(lines[1].condition).toBe('jika 68 < x ≤ 98');
  });
});
