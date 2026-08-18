const packages = [
  { value: 'foodie', label: '🍜 Thích Ăn Uống' },
  { value: 'photo', label: '📸 Sống Ảo & Check-in' },
  { value: 'relax', label: '☕ Nhịp Độ Chậm' },
]

type PackageSelectorProps = {
  selectedPackages: string[]
  onChange: (packages: string[]) => void
  onRegenerate: () => void
  isLoading: boolean
  disabled?: boolean
}

export function PackageSelector({
  selectedPackages,
  onChange,
  onRegenerate,
  isLoading,
  disabled = false,
}: PackageSelectorProps) {
  function togglePackage(value: string) {
    onChange(
      selectedPackages.includes(value)
        ? selectedPackages.filter((item) => item !== value)
        : [...selectedPackages, value],
    )
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm" aria-labelledby="package-heading">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">02 / Phong cách chuyến đi</span>
          <h2 id="package-heading" className="mt-1 text-2xl font-bold text-slate-900">Chọn hương vị cho chuyến đi của bạn.</h2>
        </div>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isLoading || disabled}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:bg-sky-600 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Đang tính toán lại...</span>
            </>
          ) : (
            <>
              <span>Cập nhật lịch trình</span>
              <span aria-hidden="true">↻</span>
            </>
          )}
        </button>
      </div>
      <div className="mt-6 flex flex-wrap gap-3" aria-label="Package tùy chọn">
        {packages.map((item) => {
          const isSelected = selectedPackages.includes(item.value)

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => togglePackage(item.value)}
              disabled={disabled}
              aria-pressed={isSelected}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all disabled:opacity-50 ${
                isSelected
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <span>{isSelected ? '✓' : '+'}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
