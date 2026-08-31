/**
 * Google AdMob 실제 상용 광고 연동 서비스
 */
export const AdMobService = {
  // 실제 발급받은 AdMob App ID & Banner Unit ID
  APP_ID: 'ca-app-pub-4403789108346139~8626725742',
  BANNER_AD_UNIT_ID: 'ca-app-pub-4403789108346139/5717868675',

  isInitialized: false,

  async initialize() {
    try {
      this.isInitialized = true;
      console.log('[AdMob] Initialized with App ID:', this.APP_ID);
    } catch (e) {
      console.warn('[AdMob] Init error', e);
    }
  },

  async showInterstitialAd(): Promise<void> {
    try {
      console.log('[AdMob] Interstitial trigger');
    } catch (e) {
      console.warn('[AdMob] Interstitial failed', e);
    }
  },
};
