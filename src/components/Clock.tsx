import React, { useEffect, useMemo } from 'react'

const Clock = () => {
    const [now, setNow] = React.useState(new Date());

    const formatter = useMemo(() => {
    return new Intl.DateTimeFormat("sr-RS", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }, []);

  useEffect(()=>{
const interval = setInterval(() => {
      setNow(new Date());
    }, 60_000);
    return ()=> clearInterval(interval)
  },[])

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md border-2 border-purple-300 ">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        🕒
      </div>

      <span className="text-sm font-medium text-gray-700 tracking-wide">
        {formatter.format(now)}
      </span>
    </div>

  )
}

export default Clock
