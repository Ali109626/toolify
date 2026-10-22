import React, { useState } from 'react'
import { DollarSign, Percent, Copy } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { calcDiscount, type DiscountResult } from '../../lib/calc'
import { useToast } from '../../components/ui/Toast'

export const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState<number>(120)
  const [discountValue, setDiscountValue] = useState<number>(25)
  const [isPercent, setIsPercent] = useState<boolean>(true)
  const [couponPercent, setCouponPercent] = useState<number>(10)
  const [taxPercent, setTaxPercent] = useState<number>(8)
  const { showToast } = useToast()

  const result: DiscountResult = calcDiscount(
    originalPrice,
    discountValue,
    isPercent,
    couponPercent,
    taxPercent
  )

  const copyAmount = (amount: number, label: string) => {
    navigator.clipboard.writeText(amount.toFixed(2))
    showToast('Copied', `${label}: $${amount.toFixed(2)} copied`)
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Inputs (2 cols) */}
        <div className="lg:col-span-2 p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Original Price ($)"
              type="number"
              min={0}
              step={0.01}
              value={originalPrice}
              onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
              leftIcon={<DollarSign className="w-4 h-4 text-slate-400" />}
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="discount-type-select" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Primary Discount:
                </label>
                <div className="flex items-center gap-1 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setIsPercent(true)}
                    className={`px-2 py-0.5 rounded ${
                      isPercent ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Percent (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPercent(false)}
                    className={`px-2 py-0.5 rounded ${
                      !isPercent ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Cash ($)
                  </button>
                </div>
              </div>
              <Input
                id="discount-type-select"
                type="number"
                min={0}
                step={0.5}
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                leftIcon={isPercent ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Stackable Coupon / Promo Code (%)"
              type="number"
              min={0}
              max={100}
              value={couponPercent}
              onChange={(e) => setCouponPercent(parseFloat(e.target.value) || 0)}
              helperText="Applied on top of discounted price"
              leftIcon={<Percent className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Sales Tax Rate (%)"
              type="number"
              min={0}
              step={0.1}
              value={taxPercent}
              onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
              helperText="Optional local VAT or sales tax"
              leftIcon={<Percent className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Quick Discount Presets */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-400">Quick presets:</span>
            {[10, 15, 20, 25, 30, 50, 70].map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => {
                  setIsPercent(true)
                  setDiscountValue(disc)
                }}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 font-semibold"
              >
                {disc}% Off
              </button>
            ))}
          </div>
        </div>

        {/* Right Summary Card (1 col) */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 flex flex-col justify-between gap-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Payment Summary
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
                Save {result.effectiveSavingsPercent.toFixed(1)}%
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Original Price</span>
                <span className="font-mono font-medium">${result.originalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Primary Discount</span>
                <span className="font-mono">-${result.primaryDiscountAmount.toFixed(2)}</span>
              </div>
              {result.couponDiscountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Extra Coupon ({couponPercent}%)</span>
                  <span className="font-mono">-${result.couponDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              {result.taxAmount > 0 && (
                <div className="flex items-center justify-between text-slate-500">
                  <span>Estimated Tax ({taxPercent}%)</span>
                  <span className="font-mono">+${result.taxAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Total savings box */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span>Total Savings:</span>
              <span className="font-mono text-sm">${result.totalDiscountAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Final Price Payable */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-2">
            <span className="text-xs font-bold uppercase text-slate-400">Final Price Payable</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#1D4ED8] dark:text-blue-400 font-mono">
                ${result.finalPrice.toFixed(2)}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => copyAmount(result.finalPrice, 'Final price')}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
