import { Dimensions } from "react-native";

export const app_name = "Gama Driver";
export const base_url = "https://star.gamaindonesian.com/";
export const api_url = "https://star.gamaindonesian.com/api/";
export const img_url = "https://star.gamaindonesian.com/uploads/";
export const sc_url = "https://star.gamaindonesian.com/api/v1/sc";

export const prefix = "driver/";
export const api_url_driver = api_url + prefix;
export const failed_url = "paypal_failed";
export const success_url = "paypal_success";

export const app_settings = prefix + "app_settings";
export const check_phone = prefix + "check_phone";
export const login = prefix + "login";
export const register = prefix + "register";
export const forgot_password = prefix + "forgot_password";
export const reset_password = prefix + "reset_password";
export const change_online_status = prefix + "change_online_status";
export const vehicle_type_list = prefix + "vehicle_type_list";
export const dashboard = prefix + "dashboard";
export const get_heatmap_coordinates = prefix + "get_heatmap_coordinates";
export const vehicle_update = prefix + "vehicle_update";
export const get_documents = prefix + "get_documents";
export const image_upload = "image_upload";
export const update_document = prefix + "update_document";
export const get_about = prefix + "get_about";
export const faq = prefix + "faq";
export const trip_request_details = prefix + "trip_request_details";
export const accept = prefix + "accept";
export const reject = prefix + "reject";
export const profile_update = prefix + "profile_update";
export const profile_confirm = prefix + "profile_confirm";
export const profile_picture_upload = prefix + "profile_image_upload";
export const profile_picture_update = prefix + "profile_picture_update";
export const get_profile = prefix + "get_profile";
export const trip_details = prefix + "trip_details";
export const change_trip_status = prefix + "change_trip_status";
export const trip_cancel = prefix + "trip_cancel";
export const get_bill = prefix + "get_bill";
export const my_bookings = prefix + "my_bookings";
export const add_rating = prefix + "add_rating";
export const get_notification_messages = prefix + "get_notification_messages";
export const withdrawal_history = prefix + "withdrawal_history";
export const withdrawal_request = prefix + "withdrawal_request";
export const earnings = prefix + "earnings";
export const tutorials = prefix + "tutorials";
export const add_wallet = prefix + "add_wallet";
export const payment_methods = prefix + "payment_methods";
export const wallet = prefix + "wallet";
export const update_kyc = prefix + "update_kyc";
export const get_kyc = prefix + "get_kyc";
export const privacy_policies = prefix + "policy";
export const change_driver_settings = prefix + "change_driver_settings";
export const get_driver_settings = prefix + "get_driver_settings";
export const get_ongoing_trip_details_shared = prefix + "get_ongoing_trip_details_shared";
export const shared_trip_accept = prefix + "accept";
export const shared_trip_reject = prefix + "reject";
export const get_driver = prefix + "get_driver";

//Header configuration for animated view
export const maxHeaderHeight = 200;
export const minHeaderHeight = 60;

//Size
export const screenHeight = Math.round(Dimensions.get("window").height);
export const screenWidth = Math.round(Dimensions.get("window").width);
export const height_40 = Math.round((40 / 100) * screenHeight);
export const height_50 = Math.round((50 / 100) * screenHeight);
export const height_60 = Math.round((60 / 100) * screenHeight);
export const height_35 = Math.round((35 / 100) * screenHeight);
export const height_20 = Math.round((20 / 100) * screenHeight);
export const height_30 = Math.round((30 / 100) * screenHeight);
export const height_17 = Math.round((17 / 100) * screenHeight);

//Map 
export const GOOGLE_KEY = "AIzaSyDU440iSHWBo-0mN3Qp_F0GJW_4uk5kTTI";
export const LATITUDE_DELTA = 0.0050;
export const LONGITUDE_DELTA = 0.0052;
export const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

//Image Path
export const logo = require(".././assets/img/logo.png");
export const arrowup = require(".././assets/img/arrowup.png");
export const logo2 = require(".././assets/img/logo-transparent.png");
export const success_icon = require(".././assets/img/success.png");
export const id_proof_icon = require('.././assets/img/id_proof_icon.png');
export const id_sim_icon = require('.././assets/img/id_sim_icon.png');
export const id_kep_icon = require('.././assets/img/id_kep_icon.png');
export const vehicle_certificate_icon = require('.././assets/img/vehicle_certificate_icon.png');
export const vehicle_insurance_icon = require('.././assets/img/vehicle_insurance_icon.png');
export const vehicle_image_icon = require('.././assets/img/vehicle_image_icon.png');
export const vehicle_image2_icon = require('.././assets/img/vehicle_image2_icon.png');
export const vehicle_image_tracking_car = require('.././assets/img/tracking/car-b.png');
export const vehicle_image_tracking_bike = require('.././assets/img/tracking/bike.png');
export const vehicle_image_tracking_home = require('.././assets/img/tracking/home.png');
export const clickable_icon = require(".././assets/img/clickable.png");
export const upload_icon = require('.././assets/img/upload_icon.png');
export const trip_cancel_icon = require('.././assets/img/trip_cancel_icon.png');
export const discount_icon = require(".././assets/img/discount.png");
export const notification_bell = require(".././assets/img/notification-bell.png");
export const bg_img = require(".././assets/img/BG.png");
export const left_arrow = require(".././assets/img/left-arrow.png");
export const right_arrow = require(".././assets/img/right-arrow.png");
export const distance_icon = require(".././assets/img/distance.png");
export const withdrawal_icon = require(".././assets/img/withdrawal.png");
export const wallet_icon = require(".././assets/img/wallet.png");
export const no_data = require(".././assets/img/no_data.png");
export const income_icon = require(".././assets/img/income.png");
export const expense_icon = require(".././assets/img/expense.png");
export const cancel = require(".././assets/img/cancel.png");
export const chat_bg = require(".././assets/img/chat_bg.png");
export const pair_car = require(".././assets/img/pair.png");
export const userLocationButton = require(".././assets/img/indicator.png");
export const power_on = require(".././assets/img/on.png");
export const power_off = require(".././assets/img/off.png");
// export const nav_on = require(".././assets/img/nav.png");
export const refresh3 = require(".././assets/img/reload3.png");
export const logo_box = require(".././assets/img/logo-new2.png");
export const poweroff = require(".././assets/img/poweroff.png");
export const suspended = require(".././assets/img/suspended.jpeg");
export const mail = require(".././assets/img/mail.png");

export const pin_new = require(".././assets/img/pin.png");

export const sc_logo = require(".././assets/img/sc.png");
export const selector_img = require(".././assets/img/selector2.png");


export const qrish1 = require(".././assets/img/qrish_gama1.jpeg");
export const qrish2 = require(".././assets/img/qrish_gama4.jpeg");
export const safety_img = require(".././assets/img/safety.png");
export const position_icon = require(".././assets/img/position.png");
export const oneway_icon = require(".././assets/img/tracking/destination.png");
//ppob
export const ppob_images = {
  axis: require(".././assets/img/ppob/new_axis.png"),
  im3: require(".././assets/img/ppob/im3.png"),
  grab_driver: require(".././assets/img/ppob/new_grab_driver.png"),
  shopee_pay: require(".././assets/img/ppob/new_shopee_pay.png"),
  dana: require(".././assets/img/ppob/new_dana.png"),
  link_aja: require(".././assets/img/ppob/new_link_aja.png"),
  telkomsel: require(".././assets/img/ppob/new_telkomsel.png"),
  etoll_bni: require(".././assets/img/ppob/new_etoll_bni.png"),
  maxim_driver: require(".././assets/img/ppob/new_maxim_driver.png"),
  three: require(".././assets/img/ppob/new_three.png"),
  etoll_brizzi: require(".././assets/img/ppob/new_etoll_brizzi.png"),
  maxim: require(".././assets/img/ppob/new_maxim.png"),
  xl: require(".././assets/img/ppob/new_xl.png"),
  etoll_mandiri: require(".././assets/img/ppob/new_etoll_mandiri.png"),
  OVO: require(".././assets/img/ppob/new_OVO.png"),
  smartfren: require(".././assets/img/ppob/smartfren.png"),
  gojek_driver: require(".././assets/img/ppob/new_gojek_driver.png"),
  shopee_pay_driver: require(".././assets/img/ppob/new_shopee_pay_driver.png"),
  pulsa: require(".././assets/img/ppob/pulsa.png"),
  pln: require(".././assets/img/ppob/pln.png"),
  emoney: require(".././assets/img/ppob/emoney.png"),
  speedcash: require(".././assets/img/speedcash_circle.png"),
  etiket: require(".././assets/img/withdrawal.png"),
};


//video 
export const moving_car = require(".././assets/img/movecar.gif");

//json path
export const profile_background = require(".././assets/json/profile_background.json");
export const pin_marker = require(".././assets/json/pin_marker.json");
export const pin_map = require(".././assets/json/pin_marker_old.json");
export const no_favourites = require(".././assets/json/no_favorites.json");
export const btn_loader = require(".././assets/json/btn_loader.json");
export const accept_loader = require(".././assets/json/accept_loader.json");
export const reject_loader = require(".././assets/json/reject_loader.json");
export const loader = require(".././assets/json/loader.json");
export const no_data_loader = require(".././assets/json/no_data_loader.json");
export const location_enable = require(".././assets/json/location_enable.json");
export const app_update = require(".././assets/json/app_update.json");
export const poweron_lt = require(".././assets/json/poweron_lt.json");
export const refresh_lt = require(".././assets/json/refresh_lt.json");
export const loading_lt = require(".././assets/json/loading_lt.json");
export const nav_lt = require(".././assets/json/nav_lt.json");

//Font Family
export const regular = "GoogleSans-Regular";
export const normal = "Montreal-Regular";
export const bold = "Montreal-Bold";

//Font Sized
export const f_tiny = 10;
export const f_xs = 12;
export const f_s = 14;
export const f_m = 16;
export const f_l = 18;
export const f_xl = 20;
export const f_xxl = 22;
export const f_25 = 25;
export const f_30 = 30;
export const f_35 = 35;

export const month_names = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//More Menu
export const menus = [
  // {
  //   menu_name: 'KYC Verification',
  //   icon: 'files-o',
  //   route: 'KycVerification'
  // },
  // {
  //   menu_name: 'Training',
  //   icon: 'user',
  //   route: 'Training'
  // },
  // {
  //   menu_name: 'Frequently Asked Questions',
  //   icon: 'question-circle-o',
  //   route: 'Faq'
  // },
  {
    menu_name: 'Pendapatan',
    icon: 'money-bill',
    route: 'Earnings'
  },
  // {
  //   menu_name: 'Ambil',
  //   icon: 'credit-card',
  //   route: 'Withdrawal'
  // },
  {
    menu_name: 'Dompet',
    icon: 'wallet',
    route: 'Wallet'
  },
  {
    menu_name: 'Gama PPOB',
    icon: 'mobile-alt',
    route: 'PPOB'
  },

  {
    menu_name: 'Keselamatan',
    icon: 'user-shield',
    route: 'Safety'
  },
  // {
  //   menu_name: 'Notifications',
  //   icon: 'bell',
  //   route: 'Notifications'
  // },
  // {
  //   menu_name: 'About Us',
  //   icon: 'building-o',
  //   route: 'AboutUs'
  // },
  {
    menu_name: 'Privacy Policies',
    icon: 'info-circle',
    route: 'PrivacyPolicies'
  },
  {
    menu_name: 'Logout',
    icon: 'sign-out-alt',
    route: 'Logout'
  },
]

export const safety_list = [
  {
    menu_name: 'Ambulance',
    icon: 'phone',
    route: 'tel:119'
  },
  {
    menu_name: 'Polisi',
    icon: 'phone',
    route: 'tel:110'
  },
]

export const AUTO_COMPLETED_TRIP_END_MS = 1000 * 60 * 20
// export const AUTO_COMPLETED_TRIP_END_MS = 1000 * 10

export const QRCODE_ANTRIAN_VALUE = "GAMA ANTRIAN CODE 3246y32987401438726587 bgf346787436"
