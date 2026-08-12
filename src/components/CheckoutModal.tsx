import React, { useState } from 'react';
import { X, CheckCircle2, ShoppingBag, Truck, Store, MapPin, Tag, Sparkles, Clock, ArrowRight, ShieldCheck, DollarSign, RefreshCw } from 'lucide-react';
import { PartyPlan, CymbalOrderDetails } from '../types';
import { formatCurrency } from '../utils/helpers';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
  onOptimizeBudget: () => Promise<void>;
  isOptimizing: boolean;
  onOrderCompleted: (orderDetails: CymbalOrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  onOptimizeBudget,
  isOptimizing,
  onOrderCompleted
}) => {
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'curbside' | 'delivery' | 'instore'>('curbside');
  const [pickupSlot, setPickupSlot] = useState<string>('Tomorrow, 9:00 AM - 10:00 AM');
  const [appliedCoupon, setAppliedCoupon] = useState<string>('CYMBALPARTY10');
  const [couponDiscount, setCouponDiscount] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<CymbalOrderDetails | null>(null);

  if (!isOpen) return null;

  const totalItemsCount = plan.shoppingList.length;
  const cymbalBrandCount = plan.shoppingList.filter(i => i.isCymbalBrand).length;
  
  const subtotal = plan.shoppingList.reduce((acc, i) => acc + (i.actualCost ?? i.estimatedCost), 0);
  const estimatedTax = Math.round(subtotal * 0.08 * 100) / 100;
  const fulfillmentFee = fulfillmentMethod === 'delivery' ? 5.99 : 0;
  const totalSavings = (cymbalBrandCount * 1.5) + couponDiscount;
  const finalTotal = Math.max(0, subtotal + estimatedTax + fulfillmentFee - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (appliedCoupon.trim().toUpperCase() === 'CYMBAL20') {
      setCouponDiscount(20);
    } else if (appliedCoupon.trim().toUpperCase() === 'CYMBALPARTY10') {
      setCouponDiscount(10);
    } else {
      setCouponDiscount(5);
    }
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const order: CymbalOrderDetails = {
        orderId: `CM-${Math.floor(100000 + Math.random() * 900000)}`,
        fulfillmentMethod,
        selectedStore: 'CymbalMart Store #402 - 123 Metro Blvd',
        pickupTimeSlot: pickupSlot,
        totalItems: totalItemsCount,
        subtotal,
        tax: estimatedTax,
        savings: totalSavings,
        finalAmount: finalTotal,
        paymentStatus: 'Paid via CymbalPay',
        orderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      setIsSubmitting(false);
      setCompletedOrder(order);
      onOrderCompleted(order);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/50 via-slate-900 to-teal-900/50 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
              CM
            </div>
            <div>
              <h2 className="font-bold text-lg text-white flex items-center gap-2">
                CymbalMart Express Checkout
              </h2>
              <p className="text-xs text-emerald-400">
                Finalize & Fulfill Party Shopping List
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {!completedOrder ? (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Event Summary Banner */}
            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Plan</span>
                <h3 className="text-base font-bold text-white">{plan.criteria.title}</h3>
                <p className="text-xs text-slate-400">
                  {plan.criteria.adultCount} Adults, {plan.criteria.kidCount} Kids • Target: ${plan.criteria.customBudgetAmount || plan.estimatedTotalBudget}
                </p>
              </div>
              <button
                onClick={onOptimizeBudget}
                disabled={isOptimizing}
                className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
                <span>{isOptimizing ? 'Optimizing...' : 'AI Budget Trim'}</span>
              </button>
            </div>

            {/* Step 1: Select Fulfillment Method */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
                1. Select CymbalMart Fulfillment Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentMethod('curbside')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition ${
                    fulfillmentMethod === 'curbside'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-950'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Store className={`w-5 h-5 ${fulfillmentMethod === 'curbside' ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">FREE</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold">Curbside Pickup</div>
                    <div className="text-[11px] text-slate-400">Loaded into trunk</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentMethod('delivery')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition ${
                    fulfillmentMethod === 'delivery'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-950'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Truck className={`w-5 h-5 ${fulfillmentMethod === 'delivery' ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">$5.99</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold">Store Delivery</div>
                    <div className="text-[11px] text-slate-400">To venue doorstep</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentMethod('instore')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition ${
                    fulfillmentMethod === 'instore'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-950'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <ShoppingBag className={`w-5 h-5 ${fulfillmentMethod === 'instore' ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Aisle Map</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold">In-Store Self Shop</div>
                    <div className="text-[11px] text-slate-400">Sorted by Aisle</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Time Slot & Store Location */}
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Pickup Location:</span>
                </div>
                <span className="text-slate-200 font-medium">CymbalMart Store #402 (Downtown)</span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-700/50 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Preferred Slot:</span>
                </div>
                <select
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Today, 4:00 PM - 5:00 PM">Today, 4:00 PM - 5:00 PM (Express)</option>
                  <option value="Today, 6:00 PM - 7:00 PM">Today, 6:00 PM - 7:00 PM</option>
                  <option value="Tomorrow, 9:00 AM - 10:00 AM">Tomorrow, 9:00 AM - 10:00 AM</option>
                  <option value="Tomorrow, 2:00 PM - 3:00 PM">Tomorrow, 2:00 PM - 3:00 PM</option>
                </select>
              </div>
            </div>

            {/* Step 3: Perks & Cymbal Savings */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" /> CymbalMart Rewards & Promo Code
                </label>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {cymbalBrandCount} Cymbal Brand Items Selected
                </span>
              </div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={appliedCoupon}
                  onChange={(e) => setAppliedCoupon(e.target.value)}
                  placeholder="Enter promo code (e.g. CYMBALPARTY10)"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 flex-1 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition"
                >
                  Apply
                </button>
              </form>
            </div>

            {/* Step 4: Price Breakdown */}
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Items Subtotal ({totalItemsCount} items)</span>
                <span className="text-slate-200">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fulfillment ({fulfillmentMethod})</span>
                <span className="text-slate-200">{fulfillmentFee === 0 ? 'FREE' : formatCurrency(fulfillmentFee)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Sales Tax (8%)</span>
                <span className="text-slate-200">{formatCurrency(estimatedTax)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>CymbalMart Promo Discount ({appliedCoupon})</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                <div>
                  <div>Total Amount</div>
                  <div className="text-[10px] font-normal text-emerald-400">Saved ~{formatCurrency(totalSavings)} with Cymbal Brands</div>
                </div>
                <div className="text-lg text-emerald-400 font-extrabold">{formatCurrency(finalTotal)}</div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CymbalPay Freshness Guarantee</span>
              </div>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm CymbalMart Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation State */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Order Confirmed!</span>
              <h3 className="text-2xl font-black text-white mt-1">CymbalMart Order #{completedOrder.orderId}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your party list is reserved and queued for store preparation.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 max-w-md mx-auto text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b border-slate-700/60 pb-2">
                <span className="text-slate-400">Pickup Slot:</span>
                <span className="text-white font-semibold">{completedOrder.pickupTimeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/60 pb-2">
                <span className="text-slate-400">Store Location:</span>
                <span className="text-white font-semibold">{completedOrder.selectedStore}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/60 pb-2">
                <span className="text-slate-400">Mode:</span>
                <span className="text-emerald-400 font-bold uppercase">{completedOrder.fulfillmentMethod}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-slate-300">Total Charged:</span>
                <span className="text-emerald-400 font-extrabold">{formatCurrency(completedOrder.finalAmount)}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
              >
                Return to Party Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
