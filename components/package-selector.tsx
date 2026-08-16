const packages = [
  { value: 'foodie', label: 'Thích Ăn Uống' },
  { value: 'photo', label: 'Sống Ảo' },
  { value: 'relax', label: 'Nhịp Độ Chậm' },
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
    <section className="border-y-2 border-black py-6" aria-labelledby="package-heading">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs font-medium tracking-[0.16em] uppercase">Tinh chỉnh hành trình</p>
          <h2 id="package-heading" className="font-display mt-3 text-3xl leading-none tracking-tight">Chọn hương vị cho chuyến đi.</h2>
        </div>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isLoading || disabled}
          className="font-mono min-h-11 w-full border-2 border-black bg-black px-5 py-3 text-xs font-medium tracking-[0.12em] text-white uppercase transition-none hover:bg-white hover:text-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white sm:w-auto"
        >
          {isLoading ? 'Đang cập nhật' : 'Tạo lại lịch trình'} <span className="ml-2" aria-hidden="true">↻</span>
        </button>
      </div>
      <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap" aria-label="Package tùy chọn">
        {packages.map((item) => {
          const isSelected = selectedPackages.includes(item.value)

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => togglePackage(item.value)}
              disabled={disabled}
              aria-pressed={isSelected}
              className={`font-mono min-h-11 border-2 border-black px-4 py-2 text-[10px] font-medium tracking-[0.1em] uppercase transition-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50 ${isSelected ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
            >
              {isSelected ? '✓ ' : '+ '}{item.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
