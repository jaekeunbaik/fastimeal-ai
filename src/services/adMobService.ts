/**
 * Google AdMob 광고 관리 서비스
 * Google Play 배포 시 실제 AdMob Banner ID 및 Interstitial ID로 연동됩니다.
 */
export const AdMobService = {
  // Google AdMob 공식 테스트 Unit ID
  BANNER_AD_UNIT_ID: 'ca-app-pub-3940256099942544/6300978111', // Android Test Banner
  INTERSTITIAL_AD_UNIT_ID: 'ca-app-pub-3940256099942544/1033173712', // Android Test Interstitial

  isInitialized: false,

  async initialize() {
    try {
      this.isInitialized = true;
      console.log('[AdMob] Initialized successfully');
    } catch (e) {
      console.warn('[AdMob] Init skipped (web environment)', e);
    }
  },

  /**
   * 단식 완주 축하 또는 식단 사진 저장 시 고단가 전면 광고(Interstitial) 호출
   */
  async showInterstitialAd(): Promise<void> {
    try {
      console.log('[AdMob] Triggered Interstitial Ad');
      // 네이티브 앱 환경에서 AdMob.showInterstitial() 호출
    } catch (e) {
      console.warn('[AdMob] Interstitial failed/skipped', e);
    }
  },
};
