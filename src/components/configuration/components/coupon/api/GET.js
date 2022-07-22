import axios from "axios";

export function getCouponList(couponType){
  return axios.get(`/admin/manage_coupons/?coupon_type=${couponType}`);
}

export function getCouponData(couponId){
  return axios.get(`/admin/manage_coupons/${couponId}/`);
}

export function getUsersForCoupon(){
  return axios.get(`/admin/manage_coupons/users/`);
}



