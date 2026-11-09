'use client';

import React, { useState } from 'react';
import { useProduct } from '@/context/ProductContext';
import { useSettings } from '@/context/SettingsContext';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  Sparkles,
  Plus,
  Minus,
  ShoppingBag,
} from 'lucide-react';

export default function OrderForm() {
  const {
    colorways,
    selectedColorway,
    setSelectedColorway,
    sizes,
    selectedSize,
    setSelectedSize,
    cartQuantity,
    setCartQuantity,
  } = useProduct();

  const { settings } = useSettings();
  const brandTitle = settings?.title || 'Henley Fashion';
  const unitPrice = selectedColorway.price || settings?.sale_price || 2150;
  const regularPrice = selectedColorway.regularPrice || settings?.regular_price || 2850;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    district: 'ঢাকা (Dhaka)',
    deliveryRegion: 'inside', // 'inside' (70) | 'outside' (130)
    paymentMethod: 'cod', // 'cod' | 'bkash'
    notes: '',
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const shippingCost = formData.deliveryRegion === 'inside' ? 70 : 130;
  const baseSubtotal = unitPrice * cartQuantity;
  const totalAmount = Math.max(0, baseSubtotal - discountAmount + shippingCost);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'HENLEY200' || promoCode.trim().toUpperCase() === 'WINTER2026') {
      const discount = 200;
      setDiscountAmount(discount);
      setPromoApplied(true);
      soundManager.playChime(750, 0.3);
    } else {
      alert('ভুল প্রোমো কোড! ২০০ টাকা ছাড়ের জন্য "HENLEY200" লিখুন।');
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address) {
      alert('দয়া করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);
    soundManager.playChime(520, 0.4);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `HNL-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setOrderComplete(true);

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f5c4', '#5effdb', '#ff9e2c', '#ffffff'],
        });
      } catch (err) {}
    }, 1100);
  };

  return (
    <section className="orderFormSection" id="pre-order">
      <div className="container">
        <div className="sectionHeaderCenter">
          <div className="section-badge">
            <span className="badge-pulse"></span>
            LIMITED PRODUCTION // BATCH 01 ALLOCATION
          </div>
          <h2 className="title">
            অর্ডার ফর্ম — <span className="text-gradient">{brandTitle} Cyber Hoodie</span>
          </h2>
          <p className="subtitle">
            ক্যাশ অন ডেলিভারি সুবিধা। পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করতে পারবেন।
            অর্ডার কনফার্ম করার জন্য নিচের ফর্মটি পূরণ করুন।
          </p>
        </div>

        {orderComplete ? (
          <div className="orderSuccessCard">
            <div className="successIcon">
              <CheckCircle2 size={48} className="checkSvg" />
            </div>
            <h3 className="successTitle">আপনার অর্ডারটি সফল হয়েছে!</h3>
            <p className="successSub">
              ধন্যবাদ <strong>{formData.name}</strong>! আপনার {brandTitle} ড্রপ-শোল্ডার হুডির অর্ডারটি
              কনফার্ম হয়েছে। আমাদের কাস্টমার কেয়ার থেকে শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করা হবে।
            </p>
            <div className="receiptDetails">
              <div className="receiptRow">
                <span>অর্ডার আইডি (Tracking ID):</span>
                <strong className="cyan">{orderId}</strong>
              </div>
              <div className="receiptRow">
                <span>কালার ও সাইজ:</span>
                <strong>
                  {selectedColorway.name} (Size: {selectedSize}) × {cartQuantity} টি
                </strong>
              </div>
              <div className="receiptRow">
                <span>সর্বমোট প্রদেয় মূল্য:</span>
                <strong>৳{totalAmount} (ক্যাশ অন ডেলিভারি)</strong>
              </div>
              <div className="receiptRow">
                <span>ডেলিভারি এরিয়া:</span>
                <span>{formData.deliveryRegion === 'inside' ? 'ঢাকার ভেতরে (৳70)' : 'ঢাকার বাইরে (৳130)'}</span>
              </div>
            </div>
            <button
              className="glow-btn"
              onClick={() => {
                setOrderComplete(false);
                setFormData({
                  name: '',
                  phone: '',
                  address: '',
                  district: 'ঢাকা (Dhaka)',
                  deliveryRegion: 'inside',
                  paymentMethod: 'cod',
                  notes: '',
                });
              }}
            >
              <span>নতুন আরেকটি অর্ডার করুন</span>
            </button>
          </div>
        ) : (
          <div className="orderFormGrid">
            {/* Left Column: Colorway, Size & Customer Info */}
            <div className="formFieldsCard">
              <h3 className="cardHeading">১. কালার ও সাইজ সিলেক্ট করুন</h3>

              {/* Colorways */}
              <div className="formFinishSelector">
                {colorways.map((c) => (
                  <div
                    key={c.id}
                    className={`finishChoice ${selectedColorway.id === c.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedColorway(c);
                      soundManager.playClick(600, 0.04);
                    }}
                  >
                    <span
                      className="swatchDot"
                      style={{ backgroundColor: c.colorHex, borderColor: c.edgeHex }}
                    ></span>
                    <div className="choiceInfo">
                      <span className="choiceName">{c.name}</span>
                      <span className="choicePrice">৳{c.price} BDT</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Size Selector */}
              <div className="sizeSelectorBlock" style={{ marginBottom: '20px' }}>
                <span className="qtyLabel" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  ড্রপ শোল্ডার সাইজ:
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {sizes.map((s) => (
                    <button
                      key={s.size}
                      type="button"
                      className={`sizePill ${selectedSize === s.size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s.size)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        background: selectedSize === s.size ? '#00f5c4' : 'rgba(255,255,255,0.06)',
                        color: selectedSize === s.size ? '#050608' : '#fff',
                        fontWeight: 700,
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="quantitySelectorRow">
                <span className="qtyLabel">অর্ডার পরিমাণ (Quantity):</span>
                <div className="qtyControls">
                  <button
                    type="button"
                    className="qtyBtn"
                    onClick={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                    disabled={cartQuantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qtyNumber">{cartQuantity}</span>
                  <button
                    type="button"
                    className="qtyBtn"
                    onClick={() => setCartQuantity(Math.min(10, cartQuantity + 1))}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <h3 className="cardHeading" style={{ marginTop: '28px' }}>
                ২. ডেলিভারি ও কন্টাক্ট ইনফরমেশন
              </h3>

              <form onSubmit={handleSubmitOrder} className="checkoutForm">
                <div className="inputRow">
                  <div className="inputGroup">
                    <label>আপনার সম্পূর্ণ নাম *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="যেমন: মোঃ সাকিব আহমেদ"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="inputGroup">
                    <label>মোবাইল নম্বর (১১ ডিজিট) *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="যেমন: 01712345678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="inputGroup fullWidth">
                  <label>সম্পূর্ণ ঠিকানা (বাসা নং, রোড নং, এলাকা/থানা) *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="যেমন: বাসা নং ১২, রোড নং ৫, ধানমন্ডি, ঢাকা"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="inputRow">
                  <div className="inputGroup">
                    <label>ডেলিভারি এরিয়া *</label>
                    <select
                      name="deliveryRegion"
                      value={formData.deliveryRegion}
                      onChange={handleInputChange}
                    >
                      <option value="inside">ঢাকার ভেতরে (ডেলিভারি চার্জ ৳70)</option>
                      <option value="outside">ঢাকার বাইরে (ডেলিভারি চার্জ ৳130)</option>
                    </select>
                  </div>
                  <div className="inputGroup">
                    <label>পেমেন্ট মেথড</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                    >
                      <option value="cod">ক্যাশ অন ডেলিভারি (Cash on Delivery)</option>
                      <option value="bkash">বিকাশ / অনলাইন পেমেন্ট</option>
                    </select>
                  </div>
                </div>

                <div className="inputGroup fullWidth">
                  <label>বিশেষ নির্দেশনা (যদি থাকে)</label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="যেমন: কল দিয়ে আসবেন বা ডেলিভারির সময়"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>

                <button
                  type="submit"
                  className="glow-btn submitBtn"
                  disabled={isSubmitting}
                >
                  <Lock size={16} />
                  <span>
                    {isSubmitting
                      ? 'অর্ডার প্রসেস হচ্ছে...'
                      : `অর্ডার কনফার্ম করুন • ৳${totalAmount} BDT`}
                  </span>
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="orderSummaryCard">
              <h3 className="summaryHeading">অর্ডার সামারি</h3>

              <div className="summaryItemPreview">
                <div
                  className="itemSwatchMini"
                  style={{
                    backgroundColor: selectedColorway.colorHex,
                    borderColor: selectedColorway.edgeHex,
                  }}
                ></div>
                <div className="itemDetails">
                  <span className="itemName">{brandTitle} Tech Hoodie</span>
                  <span className="itemEdition">
                    {selectedColorway.name} | Size: {selectedSize} × {cartQuantity}
                  </span>
                </div>
                <span className="itemCost">৳{baseSubtotal}</span>
              </div>

              <div className="includedBonusList">
                <div className="bonusItem">
                  <CheckCircle2 size={14} className="bonusCheck" />
                  <span>৪৫০ GSM হেভিওয়েট ৩-এন্ড ডায়াগনাল লুপ ফ্রেঞ্চ টেরি</span>
                </div>
                <div className="bonusItem">
                  <CheckCircle2 size={14} className="bonusCheck" />
                  <span>DWR ন্যানো-শিল্ড (ওয়াটার রিপেলেন্ট কোটিং)</span>
                </div>
                <div className="bonusItem">
                  <CheckCircle2 size={14} className="bonusCheck" />
                  <span>৭ দিনের মানিব্যাক এবং সাইজ এক্সচেঞ্জ গ্যারান্টি</span>
                </div>
              </div>

              {/* Promo Code Form */}
              <div className="promoCodeBox">
                <input
                  type="text"
                  placeholder="প্রোমো কোড (Try: HENLEY200)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={handleApplyPromo} className="applyPromoBtn">
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="promoSuccess">
                  <Sparkles size={13} />
                  <span>৳২০০ স্পেশাল ডিসকাউন্ট প্রযোজ্য হয়েছে!</span>
                </div>
              )}

              {/* Calculation Matrix */}
              <div className="calcRows">
                <div className="calcRow">
                  <span>ইউনিট প্রাইজ</span>
                  <span>৳{unitPrice}</span>
                </div>
                <div className="calcRow">
                  <span>পরিমাণ</span>
                  <span>{cartQuantity} টি</span>
                </div>
                {discountAmount > 0 && (
                  <div className="calcRow discount">
                    <span>প্রোমো ডিসকাউন্ট</span>
                    <span>-৳{discountAmount}</span>
                  </div>
                )}
                <div className="calcRow">
                  <span>ডেলিভারি চার্জ</span>
                  <span>৳{shippingCost}</span>
                </div>
                <div className="calcDivider"></div>
                <div className="calcRow total">
                  <span>সর্বমোট প্রদেয়</span>
                  <span className="totalPrice">৳{totalAmount}</span>
                </div>
              </div>

              <div className="securityBadges">
                <div className="badgeItem">
                  <ShieldCheck size={16} />
                  <span>১০০% নিরাপদ শপিং</span>
                </div>
                <div className="badgeItem">
                  <Truck size={16} />
                  <span>সারাদেশে হোম ডেলিভারি</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
