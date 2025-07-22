// バージョン管理システム
class VersionManager {
    constructor() {
        this.version = '2.1.0';
        this.buildDate = '2025-01-22';
        this.revision = 'sitemap-feature';
        this.mode = 'Production';
        this.features = [
            'サイトタイプ別プロンプト最適化',
            'カスタムKit作成・Twitter提案',
            'サイトマップ自動生成機能',
            'SEO最適化アドバイス',
            '3形式対応（ビジュアル・XML・リスト）'
        ];
        
        this.init();
    }

    init() {
        this.updateVersionDisplay();
        this.setupEventListeners();
        this.checkForUpdates();
        this.logVersionInfo();
    }

    // バージョン情報表示を更新
    updateVersionDisplay() {
        const versionNumber = document.getElementById('versionNumber');
        const buildDate = document.getElementById('buildDate');
        const detailVersion = document.getElementById('detailVersion');
        const detailBuildDate = document.getElementById('detailBuildDate');
        const detailRevision = document.getElementById('detailRevision');
        const detailMode = document.getElementById('detailMode');

        if (versionNumber) versionNumber.textContent = this.version;
        if (buildDate) buildDate.textContent = this.buildDate;
        if (detailVersion) detailVersion.textContent = this.version;
        if (detailBuildDate) detailBuildDate.textContent = this.buildDate;
        if (detailRevision) detailRevision.textContent = this.revision;
        if (detailMode) detailMode.textContent = this.mode;
        
        // 開発モードの場合
        if (this.mode === 'Development') {
            const versionDisplay = document.getElementById('versionDisplay');
            if (versionDisplay) {
                versionDisplay.classList.add('dev-mode');
            }
        }
    }

    // イベントリスナーの設定
    setupEventListeners() {
        const versionDisplay = document.getElementById('versionDisplay');
        const versionDetails = document.getElementById('versionDetails');
        const closeBtn = document.getElementById('closeVersionDetails');

        // バージョン表示をクリックで詳細表示
        versionDisplay?.addEventListener('click', () => {
            versionDetails.classList.toggle('show');
        });

        // 詳細を閉じる
        closeBtn?.addEventListener('click', () => {
            versionDetails.classList.remove('show');
        });

        // 詳細外クリックで閉じる
        document.addEventListener('click', (e) => {
            if (!versionDisplay?.contains(e.target) && !versionDetails?.contains(e.target)) {
                versionDetails?.classList.remove('show');
            }
        });

        // ESCキーで詳細を閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                versionDetails?.classList.remove('show');
            }
        });

        // ダブルクリックでバージョン情報をコピー
        versionDisplay?.addEventListener('dblclick', async () => {
            const versionInfo = this.getVersionInfoText();
            try {
                await navigator.clipboard.writeText(versionInfo);
                this.showCopySuccess();
            } catch (err) {
                console.log('バージョン情報のコピーに失敗:', err);
            }
        });
    }

    // バージョン情報テキスト生成
    getVersionInfoText() {
        return `Web制作KIT 1000選
バージョン: ${this.version}
ビルド日: ${this.buildDate}
リビジョン: ${this.revision}
モード: ${this.mode}

実装機能:
${this.features.map(feature => `• ${feature}`).join('\n')}

URL: ${window.location.href}
User Agent: ${navigator.userAgent}
画面解像度: ${screen.width}x${screen.height}
ブラウザ解像度: ${window.innerWidth}x${window.innerHeight}`;
    }

    // コピー成功表示
    showCopySuccess() {
        const versionDisplay = document.getElementById('versionDisplay');
        if (!versionDisplay) return;

        const originalHTML = versionDisplay.innerHTML;
        versionDisplay.innerHTML = `
            <span style="color: #4ade80;">✓</span>
            <span>コピー完了</span>
        `;

        setTimeout(() => {
            versionDisplay.innerHTML = originalHTML;
        }, 1500);
    }

    // アップデート確認
    checkForUpdates() {
        // ローカルストレージに保存された最後のバージョンと比較
        const lastVersion = localStorage.getItem('lastVisitedVersion');
        const currentVersion = this.version;

        if (lastVersion && lastVersion !== currentVersion) {
            this.showUpdateNotification(lastVersion, currentVersion);
        }

        localStorage.setItem('lastVisitedVersion', currentVersion);
    }

    // アップデート通知表示
    showUpdateNotification(oldVersion, newVersion) {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <strong>🎉 アップデートされました!</strong>
                <div>v${oldVersion} → v${newVersion}</div>
                <div class="update-features">
                    新機能: サイトマップ自動生成機能を追加
                </div>
                <button class="close-update">×</button>
            </div>
        `;

        // 通知スタイル
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 14px;
            box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
            animation: slideIn 0.5s ease-out;
            max-width: 300px;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .update-notification .close-update {
                position: absolute;
                top: 5px;
                right: 10px;
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 18px;
            }
            .update-features {
                font-size: 12px;
                opacity: 0.9;
                margin-top: 5px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);

        // 閉じるボタン
        notification.querySelector('.close-update').addEventListener('click', () => {
            notification.remove();
        });

        // 5秒後に自動で消す
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 8000);
    }

    // コンソールにバージョン情報をログ出力
    logVersionInfo() {
        const styles = {
            title: 'color: #667eea; font-size: 18px; font-weight: bold;',
            version: 'color: #4ade80; font-weight: bold;',
            info: 'color: #6b7280;',
            feature: 'color: #8b5cf6;'
        };

        console.log('%cWeb制作KIT 1000選', styles.title);
        console.log('%cバージョン: ' + this.version, styles.version);
        console.log('%cビルド日: ' + this.buildDate, styles.info);
        console.log('%cリビジョン: ' + this.revision, styles.info);
        console.log('%cモード: ' + this.mode, styles.info);
        console.log('\n%c実装機能:', styles.info);
        this.features.forEach(feature => {
            console.log('%c• ' + feature, styles.feature);
        });
        console.log('\n%cシステム情報:', styles.info);
        console.log('User Agent:', navigator.userAgent);
        console.log('画面解像度:', screen.width + 'x' + screen.height);
        console.log('ブラウザ解像度:', window.innerWidth + 'x' + window.innerHeight);
        console.log('言語:', navigator.language);
        console.log('プラットフォーム:', navigator.platform);
    }

    // パフォーマンス情報取得
    getPerformanceInfo() {
        if (performance && performance.timing) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
            const firstPaintTime = performance.getEntriesByType('paint')[0]?.startTime || 0;

            return {
                loadTime: Math.round(loadTime),
                domReadyTime: Math.round(domReadyTime),
                firstPaintTime: Math.round(firstPaintTime)
            };
        }
        return null;
    }

    // メモリ使用量情報取得
    getMemoryInfo() {
        if (performance && performance.memory) {
            return {
                usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        return null;
    }

    // デバッグ情報の取得
    getDebugInfo() {
        const perf = this.getPerformanceInfo();
        const memory = this.getMemoryInfo();
        
        return {
            version: this.version,
            buildDate: this.buildDate,
            revision: this.revision,
            mode: this.mode,
            url: window.location.href,
            userAgent: navigator.userAgent,
            screen: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            platform: navigator.platform,
            performance: perf,
            memory: memory,
            timestamp: new Date().toISOString()
        };
    }

    // キャッシュクリア機能
    clearCache() {
        // localStorage
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('webdesignkit_')) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {
            console.warn('localStorage清理失敗:', e);
        }

        // sessionStorage
        try {
            sessionStorage.clear();
        } catch (e) {
            console.warn('sessionStorage清理失敗:', e);
        }

        // Service Worker (もしあれば)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => {
                    registration.unregister();
                });
            });
        }

        console.log('キャッシュをクリアしました');
        alert('キャッシュをクリアしました。ページをリロードしてください。');
    }
}

// バージョン管理システムを初期化
document.addEventListener('DOMContentLoaded', () => {
    window.versionManager = new VersionManager();
    
    // グローバルにデバッグ機能を公開
    window.getDebugInfo = () => {
        return window.versionManager.getDebugInfo();
    };
    
    window.clearCache = () => {
        window.versionManager.clearCache();
    };
});

// ウィンドウ読み込み完了後にパフォーマンス情報をログ出力
window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.versionManager) {
            const perf = window.versionManager.getPerformanceInfo();
            const memory = window.versionManager.getMemoryInfo();
            
            if (perf) {
                console.log('%cパフォーマンス情報:', 'color: #f59e0b; font-weight: bold;');
                console.log('ページ読み込み時間:', perf.loadTime + 'ms');
                console.log('DOM準備時間:', perf.domReadyTime + 'ms');
                console.log('初回描画時間:', perf.firstPaintTime + 'ms');
            }
            
            if (memory) {
                console.log('%cメモリ使用量:', 'color: #ef4444; font-weight: bold;');
                console.log('使用中:', memory.usedJSHeapSize + 'MB');
                console.log('確保済み:', memory.totalJSHeapSize + 'MB');
                console.log('上限:', memory.jsHeapSizeLimit + 'MB');
            }
        }
    }, 1000);
});