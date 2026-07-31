import { AlertTriangle, Send, Signal, Wifi } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/AppContext";

const payload = {
  service: "Africa's Talking",
  senderId: "AINA-ALERT",
  campaign: "Flood Readiness Broadcast",
  message:
    "Move livestock to high ground and secure water storage assets immediately.",
  targets: ["+254700123456", "+254701456789", "+254702987654"],
};

export function SmsSimulator() {
  const { language } = useLanguage();
  const [hasBroadcasted, setHasBroadcasted] = useState(false);

  const smsText =
    language === "Swahili"
      ? "Peleka mifugo sehemu za juu na linda vyombo vya kuhifadhi maji mara moja."
      : "Move livestock to high ground and secure water storage assets immediately.";

  return (
    <section className="grid min-h-0 gap-6 lg:grid-cols-2 lg:items-start">
      <article className="flex h-auto flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Broadcast Console
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              SMS Simulator
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Mock outbound broadcast payload for county alerting and field
              distribution.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-3 text-slate-300">
            <Signal className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 grid gap-4 text-sm text-slate-300">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Mock JSON Payload
            </p>
            <pre className="mt-3 mb-2 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-200">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Target Numbers
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {payload.targets.map((target) => (
                <span
                  key={target}
                  className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-200"
                >
                  {target}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-slate-800 pt-5">
          <button
            type="button"
            onClick={() => setHasBroadcasted(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            <Send className="h-4 w-4" />
            Execute SMS Broadcast
          </button>
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            This is a simulated dispatch for prototype demonstrations only.
          </p>
        </div>
      </article>

      <article className="flex h-auto flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Virtual Smartphone
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Message Preview
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The rendered SMS updates with the current language selection.
          </p>
        </div>

        <div className="flex items-center justify-center pt-6 pb-10">
          <div className="relative w-full max-w-sm rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-900 p-3 pb-5 shadow-2xl">
            <div className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
            <div className="flex min-h-[28rem] flex-col overflow-hidden rounded-[2rem] bg-slate-100">
              <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-xs text-slate-200">
                <span>AINA Alerts</span>
                <div className="flex items-center gap-2">
                  <Wifi className="h-3.5 w-3.5" />
                  <Signal className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] p-4 pb-6">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
                  {hasBroadcasted
                    ? smsText
                    : "Press Execute SMS Broadcast to preview the outgoing alert."}
                </div>

                {hasBroadcasted ? (
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-cyan-600 p-4 text-sm leading-6 text-white shadow-sm">
                    {language === "Swahili"
                      ? "Ujumbe umetumwa kwa kundi la tahadhari na maafisa wa eneo."
                      : "Broadcast sent to alert group and field officers."}
                  </div>
                ) : null}

                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-4 text-xs text-slate-500">
                  {language === "Swahili"
                    ? "Hii ni simu ya majaribio ya ujumbe wa dharura."
                    : "This is a test simulation of the emergency message flow."}
                </div>
              </div>

              <div className="border-t border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-400">
                {language === "Swahili" ? "Simu Halisi" : "Virtual Device"}
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
