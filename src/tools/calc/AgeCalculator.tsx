import React, { useState } from 'react'
import { Calendar, Cake } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { calcAge, type AgeResult } from '../../lib/calc'

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('2000-01-15')
  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )

  const result: AgeResult | null = calcAge(birthDate, targetDate)

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Date Pickers */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="Date of Birth"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
        />

        <Input
          label="Age at the Date of"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
        />
      </div>

      {result ? (
        <div className="flex flex-col gap-6">
          {/* Primary Age Display */}
          <div className="p-5 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 shadow-sm flex flex-col items-center justify-center text-center gap-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Calculated Age
            </span>
            <div className="flex items-baseline justify-center gap-3 sm:gap-6 flex-wrap">
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-5xl font-extrabold text-[#1D4ED8] dark:text-blue-400 font-mono">
                  {result.years}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase mt-1">Years</span>
              </div>
              <span className="text-2xl text-slate-300 font-bold">•</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                  {result.months}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase mt-1">Months</span>
              </div>
              <span className="text-2xl text-slate-300 font-bold">•</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                  {result.days}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase mt-1">Days</span>
              </div>
            </div>
          </div>

          {/* Next Birthday Countdown */}
          <div className="p-4 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Cake className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Next Birthday Countdown
                </span>
                <span className="text-xs text-amber-700 dark:text-amber-300">
                  {result.nextBirthday.dateString} ({result.nextBirthday.dayOfWeek})
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-900 dark:text-amber-100 font-mono">
                {result.nextBirthday.daysRemaining}
              </span>
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                days remaining
              </span>
            </div>
          </div>

          {/* Alternative Units Grid */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Age in Alternative Units:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase text-slate-400">Total Months</span>
                <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                  {result.totalMonths.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase text-slate-400">Total Weeks</span>
                <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                  {result.totalWeeks.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase text-slate-400">Total Days</span>
                <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                  {result.totalDays.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase text-slate-400">Total Hours</span>
                <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                  {result.totalHours.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 text-center">
          Target date must be greater than or equal to date of birth.
        </div>
      )}
    </div>
  )
}
