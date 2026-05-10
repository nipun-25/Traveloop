"use client";

import { Card, Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { removeExpense } from "./actions";
import { useState } from "react";

interface BudgetBreakdownProps {
  tripId: string;
  initialData: any[];
}

export default function BudgetBreakdown({ tripId, initialData }: BudgetBreakdownProps) {
  const [data, setData] = useState(initialData);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const totalTripCost = data.reduce((acc, stop) => {
    return acc + (stop.activities?.reduce((sAcc: number, act: any) => sAcc + (act.custom_cost || 0), 0) || 0);
  }, 0);

  async function handleRemove(expenseId: string) {
    if (!confirm("Remove this expense?")) return;
    
    setIsRemoving(expenseId);
    const result = await removeExpense(tripId, expenseId);
    
    if (result.success) {
      // Optimistic update
      setData(data.map(stop => ({
        ...stop,
        activities: stop.activities?.filter((a: any) => a.id !== expenseId)
      })));
    }
    setIsRemoving(null);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Total Card */}
      <Card variant="elevated" className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-8 border-none shadow-[var(--shadow-glow)]">
        <div className="flex flex-col items-center text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-primary-200 mb-2">
            Total Estimated Budget
          </span>
          <h2 className="text-5xl font-black font-display">
            {formatCurrency(totalTripCost)}
          </h2>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-foreground font-display">
          Breakdown by Destination
        </h3>

        {data.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-border rounded-[var(--radius-xl)] text-neutral-500 text-sm">
            No destinations added yet. Add stops to start tracking expenses.
          </div>
        ) : (
          data.map((stop) => {
            const stopTotal = stop.activities?.reduce((acc: number, act: any) => acc + (act.custom_cost || 0), 0) || 0;
            const percentage = totalTripCost > 0 ? (stopTotal / totalTripCost) * 100 : 0;

            return (
              <div key={stop.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                    {stop.city?.name}
                  </h4>
                  <span className="text-sm font-bold text-foreground">
                    {formatCurrency(stopTotal)}
                  </span>
                </div>
                
                {/* Visual Bar */}
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Activity List */}
                <div className="grid grid-cols-1 gap-2 mt-1">
                  {stop.activities?.map((act: any) => (
                    <div 
                      key={act.id} 
                      className="group flex items-center justify-between p-3 rounded-[var(--radius-lg)] bg-surface-muted/50 border border-transparent hover:border-border hover:bg-white transition-all"
                    >
                      <div>
                        <div className="text-sm font-bold text-foreground">
                          {act.activity?.name}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                          {act.activity?.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-neutral-600">
                          {formatCurrency(act.custom_cost)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 p-1 h-7 w-7 text-neutral-400 hover:text-error"
                          onClick={() => handleRemove(act.id)}
                          isLoading={isRemoving === act.id}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!stop.activities || stop.activities.length === 0) && (
                    <p className="text-[10px] text-neutral-400 italic px-1">
                      No expenses logged for this stop.
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
