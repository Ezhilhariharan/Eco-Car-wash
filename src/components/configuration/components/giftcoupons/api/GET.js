import axios from "axios";

export function getGiftCoupons(pagenum = 1) {
  return axios.get(`/admin/manage_gift_coupons/?page_no=${pagenum}`);
}