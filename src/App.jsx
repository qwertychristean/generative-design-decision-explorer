import designOptions from "./data/designOptions.json";
import constraints from "./data/constraints.json";

const scoreOption = (option) => {
  const safetyScore = option.factorOfSafety * 30;
  const weightScore = (2.0 - option.weightKg) * 25;
  const leadTimeScore = (20 - option.leadTimeDays) * 1.5;
  const costPenalty = option.estimatedCost === "High" ? 12 : 4;
  return Math.round(safetyScore + weightScore + leadTimeScore - costPenalty);
};

const rankedOptions = [...designOptions]
  .map((option) => ({ ...option, score: scoreOption(option) }))
  .sort((a, b) => b.score - a.score);

const bestOption = rankedOptions[0];

function MetricCard({ label, value, note }) {
  return (
    <div className="metric-card">
      <p className="small-label">{label}</p>
      <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
      <p className="mt-2 text-sm text-zinc-400">{note}</p>
    </div>
  );
}

function ConstraintList({ title, items }) {
  return (
    <div className="panel p-5">
      <p className="small-label">{title}</p>
      <ul className="mt-4 space-y-3 text-sm text-zinc-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-papaya" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScatterPlot() {
  const maxWeight = 2.0;
  const maxSafety = 3.0;

  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="small-label">Tradeoff View</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Weight vs Safety Factor</h2>
        </div>
        <p className="max-w-xs text-right text-xs text-zinc-500">Lower weight is better. Higher safety factor is better. This chart uses mock data.</p>
      </div>
      <div className="relative mt-6 h-72 rounded-xl border border-zinc-800 bg-zinc-950">
        <div className="absolute left-6 top-4 text-xs text-zinc-500">Higher safety</div>
        <div className="absolute bottom-4 right-6 text-xs text-zinc-500">Heavier</div>
        <div className="absolute inset-8 border-l border-b border-zinc-700" />
        {rankedOptions.map((option) => {
          const left = 12 + (option.weightKg / maxWeight) * 76;
          const bottom = 12 + (option.factorOfSafety / maxSafety) * 76;
          return (
            <div
              key={option.id}
              className="absolute flex h-10 w-10 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border border-papaya bg-papaya/20 text-sm font-bold text-papaya"
              style={{ left: `${left}%`, bottom: `${bottom}%` }}
              title={option.name}
            >
              {option.id}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecommendationPanel() {
  return (
    <div className="panel border-papaya/40 p-6">
      <p className="small-label">Recommended Next Review</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{bestOption.name}</h2>
      <p className="mt-4 text-zinc-300">{bestOption.recommendation}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-zinc-900 p-4">
          <p className="text-xs text-zinc-500">Weight</p>
          <p className="mt-1 text-lg font-semibold text-white">{bestOption.weightKg} kg</p>
        </div>
        <div className="rounded-xl bg-zinc-900 p-4">
          <p className="text-xs text-zinc-500">Safety Factor</p>
          <p className="mt-1 text-lg font-semibold text-white">{bestOption.factorOfSafety}</p>
        </div>
        <div className="rounded-xl bg-zinc-900 p-4">
          <p className="text-xs text-zinc-500">Decision Score</p>
          <p className="mt-1 text-lg font-semibold text-white">{bestOption.score}</p>
        </div>
      </div>
      <p className="mt-5 rounded-xl border border-zinc-800 bg-black p-4 text-sm text-zinc-400">Risk note: {bestOption.risk}</p>
    </div>
  );
}

function OptionsTable() {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-zinc-800 p-5">
        <p className="small-label">Design Option Review</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Generated Options Comparison</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-zinc-900 text-xs uppercase tracking-widest text-zinc-400">
            <tr>
              <th className="px-5 py-4">Option</th>
              <th className="px-5 py-4">Material</th>
              <th className="px-5 py-4">Method</th>
              <th className="px-5 py-4">Weight</th>
              <th className="px-5 py-4">Safety</th>
              <th className="px-5 py-4">Cost</th>
              <th className="px-5 py-4">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-300">
            {rankedOptions.map((option) => (
              <tr key={option.id} className="hover:bg-zinc-900/60">
                <td className="px-5 py-4 font-semibold text-white">{option.name}</td>
                <td className="px-5 py-4">{option.material}</td>
                <td className="px-5 py-4">{option.manufacturing}</td>
                <td className="px-5 py-4">{option.weightKg} kg</td>
                <td className="px-5 py-4">{option.factorOfSafety}</td>
                <td className="px-5 py-4">{option.estimatedCost}</td>
                <td className="px-5 py-4 text-zinc-400">{option.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(255,135,0,0.16),_transparent_36%),#050505] px-5 py-6 text-zinc-100 lg:px-10">
      <header className="mx-auto max-w-7xl">
        <nav className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-6 md:flex-row md:items-center">
          <div>
            <p className="small-label">Self-directed portfolio project</p>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-5xl">Generative Design Decision Explorer</h1>
          </div>
          <div className="rounded-full border border-papaya/50 px-5 py-3 text-sm font-semibold text-papaya">Motorsport Concept</div>
        </nav>
      </header>

      <section className="mx-auto mt-8 grid max-w-7xl gap-5 lg:grid-cols-4">
        <MetricCard label="Part Scenario" value="Bracket" note={constraints.partName} />
        <MetricCard label="Options Reviewed" value={designOptions.length} note="Mock AI-generated design options" />
        <MetricCard label="Best Weight" value="0.9 kg" note="Lightest option in the comparison set" />
        <MetricCard label="Top Safety" value="2.6" note="Highest factor of safety in the mock data" />
      </section>

      <section className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <RecommendationPanel />
        <div className="panel p-6">
          <p className="small-label">Project Goal</p>
          <p className="mt-3 text-lg leading-8 text-zinc-200">{constraints.projectGoal}</p>
          <p className="mt-5 rounded-xl bg-zinc-900 p-4 text-sm text-zinc-400">This dashboard does not validate engineering performance. It shows how generated design choices might be organized for review.</p>
        </div>
      </section>

      <section className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-3">
        <ConstraintList title="Preserve Geometry" items={constraints.preserveGeometry} />
        <ConstraintList title="Obstacle Geometry" items={constraints.obstacleGeometry} />
        <ConstraintList title="Loads and Forces" items={constraints.loadsAndForces} />
      </section>

      <section className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ScatterPlot />
        <OptionsTable />
      </section>

      <footer className="mx-auto mt-10 max-w-7xl border-t border-zinc-800 py-6 text-sm text-zinc-500">
        Built as a concept project to connect Information Science, generative AI workflows, and motorsport decision support.
      </footer>
    </main>
  );
}

export default App;
