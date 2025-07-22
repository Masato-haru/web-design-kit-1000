// ユーティリティ関数群
class Utils {
    // デバウンス関数
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // DOM要素の安全な取得
    static getElementById(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`要素が見つかりません: ${id}`);
        }
        return element;
    }

    // DOM要素の安全な取得（複数）
    static querySelectorAll(selector) {
        return document.querySelectorAll(selector);
    }

    // 安全なイベントリスナー追加
    static addEventListenerSafe(element, event, handler) {
        if (!element) {
            console.error('要素が存在しません - イベントリスナーを追加できません');
            return false;
        }
        element.addEventListener(event, handler);
        return true;
    }

    // ローディング表示
    static showLoading(elementId = 'loading') {
        const loading = document.getElementById(elementId);
        if (loading) {
            loading.style.display = 'flex';
        }
    }

    // ローディング非表示
    static hideLoading(elementId = 'loading') {
        const loading = document.getElementById(elementId);
        if (loading) {
            loading.style.display = 'none';
        }
    }

    // エラー表示
    static showError(message, elementId = 'error-message') {
        console.error(message);
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // クリップボードにコピー
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('クリップボードのコピーに失敗:', err);
            return false;
        }
    }

    // 配列をシャッフル
    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // 色の明度を計算
    static calculateLuminance(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return 0;
        
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // HEXからRGBに変換
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // 文字列のハッシュ値を計算
    static hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }
}

export default Utils;