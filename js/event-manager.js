import Utils from './utils.js';

// イベント管理クラス
class EventManager {
    constructor(app) {
        this.app = app;
        this.debounceTimeout = null;
    }

    // すべてのイベントリスナーを設定
    setupAllEventListeners() {
        this.setupSearchEvents();
        this.setupFilterEvents();
        this.setupSortEvents();
        this.setupModalEvents();
        this.setupSidebarEvents();
        this.setupPaginationEvents();
        this.setupCustomKitEvents();
        this.setupGlobalEvents();
    }

    // 検索関連のイベント
    setupSearchEvents() {
        const searchInput = Utils.getElementById('searchInput');
        if (searchInput) {
            const debouncedSearch = Utils.debounce(() => {
                this.app.handleSearch();
            }, 300);
            
            Utils.addEventListenerSafe(searchInput, 'input', debouncedSearch);
        }
    }

    // フィルター関連のイベント
    setupFilterEvents() {
        // 業種フィルター
        const industryFilter = Utils.getElementById('industryFilter');
        Utils.addEventListenerSafe(industryFilter, 'change', () => {
            this.app.handleFilterChange();
        });

        // サイトタイプセレクター
        const siteTypeSelector = Utils.getElementById('siteTypeSelector');
        Utils.addEventListenerSafe(siteTypeSelector, 'change', (e) => {
            this.app.handleSiteTypeChange(e.target.value);
        });

        // カラーフィルター
        const colorCheckboxes = Utils.querySelectorAll('.color-checkbox input[type="checkbox"]');
        colorCheckboxes.forEach(checkbox => {
            Utils.addEventListenerSafe(checkbox, 'change', () => {
                this.app.handleFilterChange();
            });
        });
    }

    // ソート関連のイベント
    setupSortEvents() {
        // ソート条件チェックボックス
        const sortCheckboxes = Utils.querySelectorAll('.sort-checkbox input[type="checkbox"]');
        sortCheckboxes.forEach(checkbox => {
            Utils.addEventListenerSafe(checkbox, 'change', async () => {
                await this.app.handleSortChange();
            });
        });

        // ソートクリアボタン
        const clearSortBtn = Utils.getElementById('clearSortBtn');
        Utils.addEventListenerSafe(clearSortBtn, 'click', () => {
            this.app.handleClearSort();
        });
    }

    // モーダル関連のイベント
    setupModalEvents() {
        const modal = Utils.getElementById('modal');
        const closeModal = Utils.getElementById('closeModal');
        
        // モーダルを閉じる
        Utils.addEventListenerSafe(closeModal, 'click', () => {
            this.app.uiComponents.hideModal();
        });

        // モーダル外クリックで閉じる
        Utils.addEventListenerSafe(window, 'click', (e) => {
            if (e.target === modal) {
                this.app.uiComponents.hideModal();
            }
        });
    }

    // サイドバー関連のイベント
    setupSidebarEvents() {
        const mobileFilterToggle = Utils.getElementById('mobileFilterToggle');
        const sidebarClose = Utils.getElementById('sidebarClose');
        const sidebarOverlay = Utils.getElementById('sidebarOverlay');

        // モバイルフィルターボタン
        Utils.addEventListenerSafe(mobileFilterToggle, 'click', () => {
            this.app.uiComponents.showSidebar();
        });

        // サイドバー閉じるボタン
        Utils.addEventListenerSafe(sidebarClose, 'click', () => {
            this.app.uiComponents.hideSidebar();
        });

        // オーバーレイクリックで閉じる
        Utils.addEventListenerSafe(sidebarOverlay, 'click', () => {
            this.app.uiComponents.hideSidebar();
        });

        // リサイズ時の処理
        Utils.addEventListenerSafe(window, 'resize', () => {
            if (window.innerWidth > 768) {
                this.app.uiComponents.hideSidebar();
            }
        });
    }

    // ページネーション関連のイベント
    setupPaginationEvents() {
        // ページネーションのクリックは動的に追加されるため、
        // 委譲イベントリスナーを使用
        Utils.addEventListenerSafe(document, 'click', (e) => {
            if (e.target.classList.contains('page-btn')) {
                const page = parseInt(e.target.dataset.page);
                if (!isNaN(page)) {
                    this.app.handlePageChange(page);
                }
            }
        });
    }

    // カスタムKit関連のイベント
    setupCustomKitEvents() {
        const createCustomKitBtn = Utils.getElementById('createCustomKitBtn');
        Utils.addEventListenerSafe(createCustomKitBtn, 'click', () => {
            this.app.handleCreateCustomKit();
        });
    }

    // グローバルイベント
    setupGlobalEvents() {
        // ESCキーでモーダル・サイドバーを閉じる
        Utils.addEventListenerSafe(document, 'keydown', (e) => {
            if (e.key === 'Escape') {
                this.app.uiComponents.hideModal();
                this.app.uiComponents.hideSidebar();
            }
        });

        // キットカードのクリック（委譲イベント）
        Utils.addEventListenerSafe(document, 'click', async (e) => {
            // キットカードのクリック
            const kitCard = e.target.closest('.kit-card');
            if (kitCard && !e.target.closest('.copy-button')) {
                const kitId = kitCard.dataset.kitId;
                await this.app.handleKitCardClick(kitId);
            }

            // コピーボタンのクリック
            const copyButton = e.target.closest('.copy-button');
            if (copyButton) {
                e.stopPropagation();
                const kitId = copyButton.dataset.kitId;
                await this.app.handleCopyButtonClick(kitId);
            }

            // Twitter提案ボタンのクリック
            const twitterButton = e.target.closest('.twitter-proposal');
            if (twitterButton) {
                e.stopPropagation();
                const kitId = twitterButton.dataset.kitId;
                await this.app.handleTwitterProposal(kitId);
            }
        });
    }

    // デバウンス付きイベントハンドラー
    debounceHandler(handler, delay = 300) {
        return (...args) => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => handler.apply(this, args), delay);
        };
    }

    // 動的イベントリスナーの追加（モーダル内など）
    addDynamicEventListeners(container, events) {
        events.forEach(({ selector, event, handler }) => {
            const element = container.querySelector(selector);
            Utils.addEventListenerSafe(element, event, handler);
        });
    }

    // イベントリスナーのクリーンアップ
    removeEventListeners() {
        // 必要に応じてイベントリスナーを削除
        // メモリリークを防ぐため
    }
}

export default EventManager;