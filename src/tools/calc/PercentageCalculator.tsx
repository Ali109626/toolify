import React, { useState } from 'react'
import { Copy } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { calcPercentageOf, calcWhatPercent, calcPercentageChange } from '../../lib/calc'
import { useToast } from '../../components/ui/Toast'

export const PercentageCalculator: React.FC = () => {
  // Mode 1: What is X% of Y
  const [m1Percent, setM1Percent] = useState<number>(20)
  const [m1Total, setM1Total] = useState<number>(150)

  // Mode 2: X is what % of Y
  const [m2Part, setM2Part] = useState<number>(45)
  const [m2Total, setM2Total] = useState<number>(180)

  // Mode 3: Change from X to Y
  const [m3From, setM3From] = useState<number>(80)
  const [m3To, setM3To] = useState<number>(120)

  const { showToast } = useToast()

  const copyResult = (val: string | number) => {
    navigator.clipboard.writeText(val.toString())
    showToast('Copied', `${val} copied to clipboard`)
  }

  // Calculations
  const r1 = calcPercentageOf(m1Percent, m1Total)
  const r2 = calcWhatPercent(m2Part, m2Total)
  const r3 = calcPercentageChange(m3From, m3To)

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Mode 1: Percentage of a number */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            1
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            What is X% of Y?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Input
            label="Percentage (X%)"
            type="number"
            value={m1Percent}
            onChange={(e) => setM1Percent(parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Total Amount (Y)"
            type="number"
            value={m1Total}
            onChange={(e) => setM1Total(parseFloat(e.target.value) || 0)}
          />

          {/* Computed Answer Card */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">Result</span>
              <span className="text-xl font-extrabold text-[#1D4ED8] dark:text-blue-400 font-mono">
                {r1.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyResult(r1)}
              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <span className="text-[11px] text-slate-500 font-mono">
          Formula: ({m1Percent} ÷ 100) × {m1Total} = {r1}
        </span>
      </div>

      {/* Mode 2: What percentage is X of Y */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            2
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            X is what percentage of Y?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Input
            label="Portion Value (X)"
            type="number"
            value={m2Part}
            onChange={(e) => setM2Part(parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Total Base Value (Y)"
            type="number"
            value={m2Total}
            onChange={(e) => setM2Total(parseFloat(e.target.value) || 0)}
          />

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">Result</span>
              <span className="text-xl font-extrabold text-[#1D4ED8] dark:text-blue-400 font-mono">
                {r2.toFixed(2)}%
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyResult(`${r2.toFixed(2)}%`)}
              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <span className="text-[11px] text-slate-500 font-mono">
          Formula: ({m2Part} ÷ {m2Total}) × 100 = {r2.toFixed(2)}%
        </span>
      </div>

      {/* Mode 3: Percentage increase/decrease */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            3
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Percentage Increase or Decrease from X to Y
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Input
            label="Original Value (X)"
            type="number"
            value={m3From}
            onChange={(e) => setM3From(parseFloat(e.target.value) || 0)}
          />
          <Input
            label="New Value (Y)"
            type="number"
            value={m3To}
            onChange={(e) => setM3To(parseFloat(e.target.value) || 0)}
          />

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                {r3.isIncrease ? 'Percentage Increase' : 'Percentage Decrease'}
              </span>
              <span
                className={`text-xl font-extrabold font-mono ${
                  r3.isIncrease ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {r3.percentChange >= 0 ? `+${r3.percentChange.toFixed(2)}%` : `${r3.percentChange.toFixed(2)}%`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyResult(`${r3.percentChange.toFixed(2)}%`)}
              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <span className="text-[11px] text-slate-500 font-mono">
          Formula: (({m3To} - {m3From}) ÷ |{m3From}|) × 100 = {r3.percentChange.toFixed(2)}% (Absolute Difference: {r3.difference})
        </span>
      </div>
    </div>
  )
}
