import sys

def generate_cycle_code(steps):
    code = """
<div className="relative w-full py-[10vh]">
  <div className="max-w-4xl mx-auto px-6">
    <div className="relative space-y-0">
"""
    for i, step in enumerate(steps):
        title, desc = step.split('|')
        z_index = i + 1
        margin_top = f"{i * 60}vh"
        code += f"""
      {'{/* Step ' + str(z_index) + ' */}'}
      <div 
        className="sticky top-0 h-0 overflow-visible z-[{z_index}]"
        style={{{{ marginTop: '{margin_top}' }}}}
      >
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl transform transition-all duration-700 hover:scale-[1.02]">
          <div className="flex items-start gap-6">
            <div className="text-4xl font-mono opacity-20">{str(z_index).zfill(2)}</div>
            <div className="space-y-4 flex-1">
              <h3 className="text-3xl font-bold tracking-tighter">{title.strip()}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">{desc.strip()}</p>
              <div className="pt-4 flex items-center gap-4 text-[10px] font-mono opacity-30 uppercase tracking-widest border-t border-white/5">
                <span>Registry: CYCLE_NODE_{z_index}</span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span>Status: INITIALIZED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
"""
    code += """
    </div>
  </div>
  {/* Extra padding to allow the last card to be visible before scrolling past */}
  <div className="h-[120vh]" />
</div>
"""
    return code

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_cycle.py 'Title 1 | Desc 1' 'Title 2 | Desc 2' ...")
        sys.exit(1)
    
    steps = sys.argv[1:]
    print(generate_cycle_code(steps))
