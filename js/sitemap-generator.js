// サイトマップ生成クラス
class SitemapGenerator {
    constructor() {
        this.templates = this.initializeSitemapTemplates();
    }

    // サイトマップテンプレートの初期化
    initializeSitemapTemplates() {
        return {
            corporate: {
                name: "コーポレートサイト",
                description: "企業の信頼性を重視した構造",
                structure: this.getCorporateSitemap(),
                xmlTemplate: this.getCorporateXMLSitemap()
            },
            landing: {
                name: "ランディングページ",
                description: "コンバージョン重視の1ページ構造",
                structure: this.getLandingPageSitemap(),
                xmlTemplate: this.getLandingXMLSitemap()
            },
            ecommerce: {
                name: "ECサイト",
                description: "商品販売に最適化された構造",
                structure: this.getEcommerceSitemap(),
                xmlTemplate: this.getEcommerceXMLSitemap()
            },
            blog: {
                name: "ブログサイト",
                description: "SEOとユーザビリティを重視した構造",
                structure: this.getBlogSitemap(),
                xmlTemplate: this.getBlogXMLSitemap()
            },
            portfolio: {
                name: "ポートフォリオサイト",
                description: "作品展示に最適化された構造",
                structure: this.getPortfolioSitemap(),
                xmlTemplate: this.getPortfolioXMLSitemap()
            }
        };
    }

    // コーポレートサイトのサイトマップ
    getCorporateSitemap() {
        return {
            "トップページ": {
                url: "/",
                priority: "1.0",
                changefreq: "weekly",
                description: "企業のメイン情報とナビゲーション",
                children: {
                    "企業情報": {
                        url: "/about/",
                        priority: "0.9",
                        changefreq: "monthly",
                        description: "会社概要、企業理念、沿革",
                        children: {
                            "会社概要": {
                                url: "/about/company/",
                                priority: "0.8",
                                changefreq: "monthly"
                            },
                            "代表挨拶": {
                                url: "/about/message/",
                                priority: "0.7",
                                changefreq: "monthly"
                            },
                            "企業理念": {
                                url: "/about/philosophy/",
                                priority: "0.7",
                                changefreq: "monthly"
                            },
                            "沿革": {
                                url: "/about/history/",
                                priority: "0.6",
                                changefreq: "yearly"
                            },
                            "アクセス": {
                                url: "/about/access/",
                                priority: "0.8",
                                changefreq: "monthly"
                            }
                        }
                    },
                    "事業・サービス": {
                        url: "/services/",
                        priority: "0.9",
                        changefreq: "monthly",
                        description: "提供サービス・事業内容",
                        children: {
                            "サービス一覧": {
                                url: "/services/list/",
                                priority: "0.8",
                                changefreq: "monthly"
                            },
                            "サービス詳細": {
                                url: "/services/detail/",
                                priority: "0.8",
                                changefreq: "monthly"
                            },
                            "料金プラン": {
                                url: "/services/pricing/",
                                priority: "0.8",
                                changefreq: "monthly"
                            }
                        }
                    },
                    "実績・事例": {
                        url: "/works/",
                        priority: "0.8",
                        changefreq: "monthly",
                        description: "導入事例、実績紹介",
                        children: {
                            "事例一覧": {
                                url: "/works/list/",
                                priority: "0.7",
                                changefreq: "monthly"
                            },
                            "事例詳細": {
                                url: "/works/detail/",
                                priority: "0.7",
                                changefreq: "monthly"
                            }
                        }
                    },
                    "お知らせ": {
                        url: "/news/",
                        priority: "0.7",
                        changefreq: "weekly",
                        description: "企業からのお知らせ、プレスリリース",
                        children: {
                            "お知らせ一覧": {
                                url: "/news/list/",
                                priority: "0.6",
                                changefreq: "weekly"
                            },
                            "お知らせ詳細": {
                                url: "/news/detail/",
                                priority: "0.6",
                                changefreq: "weekly"
                            }
                        }
                    },
                    "採用情報": {
                        url: "/recruit/",
                        priority: "0.7",
                        changefreq: "monthly",
                        description: "求人情報、採用メッセージ",
                        children: {
                            "募集要項": {
                                url: "/recruit/jobs/",
                                priority: "0.6",
                                changefreq: "monthly"
                            },
                            "採用メッセージ": {
                                url: "/recruit/message/",
                                priority: "0.6",
                                changefreq: "monthly"
                            }
                        }
                    },
                    "お問い合わせ": {
                        url: "/contact/",
                        priority: "0.8",
                        changefreq: "monthly",
                        description: "各種お問い合わせフォーム",
                        children: {
                            "お問い合わせフォーム": {
                                url: "/contact/form/",
                                priority: "0.8",
                                changefreq: "monthly"
                            },
                            "よくある質問": {
                                url: "/contact/faq/",
                                priority: "0.7",
                                changefreq: "monthly"
                            }
                        }
                    }
                }
            }
        };
    }

    // ランディングページのサイトマップ
    getLandingPageSitemap() {
        return {
            "ランディングページ": {
                url: "/",
                priority: "1.0",
                changefreq: "weekly",
                description: "1ページ完結型のコンバージョン重視ページ",
                sections: {
                    "ヒーローセクション": {
                        anchor: "#hero",
                        description: "インパクトのあるメインメッセージ"
                    },
                    "問題提起": {
                        anchor: "#problem",
                        description: "ターゲットの課題・悩みを明確化"
                    },
                    "解決策提示": {
                        anchor: "#solution",
                        description: "商品・サービスによる解決方法"
                    },
                    "ベネフィット": {
                        anchor: "#benefits",
                        description: "得られる利益・メリット"
                    },
                    "社会的証明": {
                        anchor: "#testimonials",
                        description: "お客様の声・実績・権威性"
                    },
                    "料金・プラン": {
                        anchor: "#pricing",
                        description: "明確な価格設定"
                    },
                    "FAQ": {
                        anchor: "#faq",
                        description: "よくある質問・不安解消"
                    },
                    "申込・CTA": {
                        anchor: "#cta",
                        description: "最終的な行動喚起"
                    }
                },
                children: {
                    "プライバシーポリシー": {
                        url: "/privacy/",
                        priority: "0.5",
                        changefreq: "yearly"
                    },
                    "特定商取引法": {
                        url: "/legal/",
                        priority: "0.5",
                        changefreq: "yearly"
                    }
                }
            }
        };
    }

    // ECサイトのサイトマップ
    getEcommerceSitemap() {
        return {
            "トップページ": {
                url: "/",
                priority: "1.0",
                changefreq: "daily",
                description: "商品カテゴリ、おすすめ商品、セール情報",
                children: {
                    "商品カテゴリ": {
                        url: "/categories/",
                        priority: "0.9",
                        changefreq: "weekly",
                        children: {
                            "カテゴリ一覧": {
                                url: "/categories/list/",
                                priority: "0.8",
                                changefreq: "weekly"
                            },
                            "商品一覧": {
                                url: "/products/",
                                priority: "0.8",
                                changefreq: "daily"
                            },
                            "商品詳細": {
                                url: "/products/detail/",
                                priority: "0.8",
                                changefreq: "daily"
                            }
                        }
                    },
                    "ショッピングカート": {
                        url: "/cart/",
                        priority: "0.7",
                        changefreq: "always",
                        description: "商品選択・数量変更"
                    },
                    "決済・注文": {
                        url: "/checkout/",
                        priority: "0.7",
                        changefreq: "monthly",
                        children: {
                            "お客様情報入力": {
                                url: "/checkout/customer/",
                                priority: "0.7",
                                changefreq: "monthly"
                            },
                            "配送方法選択": {
                                url: "/checkout/shipping/",
                                priority: "0.7",
                                changefreq: "monthly"
                            },
                            "決済方法選択": {
                                url: "/checkout/payment/",
                                priority: "0.7",
                                changefreq: "monthly"
                            },
                            "注文確認": {
                                url: "/checkout/confirm/",
                                priority: "0.7",
                                changefreq: "monthly"
                            },
                            "注文完了": {
                                url: "/checkout/complete/",
                                priority: "0.6",
                                changefreq: "monthly"
                            }
                        }
                    },
                    "マイアカウント": {
                        url: "/account/",
                        priority: "0.6",
                        changefreq: "monthly",
                        children: {
                            "会員登録": {
                                url: "/account/register/",
                                priority: "0.6",
                                changefreq: "monthly"
                            },
                            "ログイン": {
                                url: "/account/login/",
                                priority: "0.6",
                                changefreq: "monthly"
                            },
                            "注文履歴": {
                                url: "/account/orders/",
                                priority: "0.6",
                                changefreq: "weekly"
                            },
                            "お気に入り": {
                                url: "/account/favorites/",
                                priority: "0.5",
                                changefreq: "weekly"
                            }
                        }
                    },
                    "サポート": {
                        url: "/support/",
                        priority: "0.7",
                        changefreq: "monthly",
                        children: {
                            "よくある質問": {
                                url: "/support/faq/",
                                priority: "0.7",
                                changefreq: "monthly"
                            },
                            "配送・返品について": {
                                url: "/support/shipping/",
                                priority: "0.7",
                                changefreq: "monthly"
                            },
                            "お問い合わせ": {
                                url: "/support/contact/",
                                priority: "0.7",
                                changefreq: "monthly"
                            }
                        }
                    },
                    "企業情報": {
                        url: "/company/",
                        priority: "0.6",
                        changefreq: "yearly",
                        children: {
                            "会社概要": {
                                url: "/company/about/",
                                priority: "0.5",
                                changefreq: "yearly"
                            },
                            "プライバシーポリシー": {
                                url: "/company/privacy/",
                                priority: "0.5",
                                changefreq: "yearly"
                            },
                            "特定商取引法": {
                                url: "/company/legal/",
                                priority: "0.6",
                                changefreq: "yearly"
                            }
                        }
                    }
                }
            }
        };
    }

    // ブログサイトのサイトマップ
    getBlogSitemap() {
        return {
            "トップページ": {
                url: "/",
                priority: "1.0",
                changefreq: "daily",
                description: "最新記事、人気記事、カテゴリ一覧",
                children: {
                    "記事一覧": {
                        url: "/posts/",
                        priority: "0.9",
                        changefreq: "daily",
                        children: {
                            "記事詳細": {
                                url: "/posts/detail/",
                                priority: "0.8",
                                changefreq: "monthly"
                            },
                            "人気記事": {
                                url: "/posts/popular/",
                                priority: "0.7",
                                changefreq: "weekly"
                            },
                            "新着記事": {
                                url: "/posts/recent/",
                                priority: "0.8",
                                changefreq: "daily"
                            }
                        }
                    },
                    "カテゴリ": {
                        url: "/categories/",
                        priority: "0.8",
                        changefreq: "weekly",
                        children: {
                            "カテゴリ一覧": {
                                url: "/categories/list/",
                                priority: "0.7",
                                changefreq: "weekly"
                            },
                            "カテゴリ別記事": {
                                url: "/categories/posts/",
                                priority: "0.7",
                                changefreq: "daily"
                            }
                        }
                    },
                    "タグ": {
                        url: "/tags/",
                        priority: "0.7",
                        changefreq: "weekly",
                        children: {
                            "タグ一覧": {
                                url: "/tags/list/",
                                priority: "0.6",
                                changefreq: "weekly"
                            },
                            "タグ別記事": {
                                url: "/tags/posts/",
                                priority: "0.6",
                                changefreq: "daily"
                            }
                        }
                    },
                    "アーカイブ": {
                        url: "/archive/",
                        priority: "0.6",
                        changefreq: "monthly",
                        children: {
                            "年別アーカイブ": {
                                url: "/archive/yearly/",
                                priority: "0.5",
                                changefreq: "monthly"
                            },
                            "月別アーカイブ": {
                                url: "/archive/monthly/",
                                priority: "0.5",
                                changefreq: "monthly"
                            }
                        }
                    },
                    "検索": {
                        url: "/search/",
                        priority: "0.7",
                        changefreq: "always",
                        description: "サイト内記事検索"
                    },
                    "プロフィール": {
                        url: "/profile/",
                        priority: "0.7",
                        changefreq: "monthly",
                        description: "運営者・ライター紹介",
                        children: {
                            "運営者について": {
                                url: "/profile/about/",
                                priority: "0.6",
                                changefreq: "monthly"
                            },
                            "お問い合わせ": {
                                url: "/profile/contact/",
                                priority: "0.6",
                                changefreq: "monthly"
                            }
                        }
                    },
                    "RSS": {
                        url: "/rss.xml",
                        priority: "0.5",
                        changefreq: "daily",
                        description: "RSS配信フィード"
                    },
                    "サイトマップ": {
                        url: "/sitemap.xml",
                        priority: "0.5",
                        changefreq: "weekly"
                    }
                }
            }
        };
    }

    // ポートフォリオサイトのサイトマップ
    getPortfolioSitemap() {
        return {
            "トップページ": {
                url: "/",
                priority: "1.0",
                changefreq: "monthly",
                description: "印象的な自己紹介、最新作品紹介",
                children: {
                    "プロフィール": {
                        url: "/about/",
                        priority: "0.9",
                        changefreq: "monthly",
                        description: "経歴、スキル、専門分野",
                        children: {
                            "経歴": {
                                url: "/about/career/",
                                priority: "0.8",
                                changefreq: "monthly"
                            },
                            "スキル": {
                                url: "/about/skills/",
                                priority: "0.8",
                                changefreq: "monthly"
                            },
                            "受賞歴": {
                                url: "/about/awards/",
                                priority: "0.7",
                                changefreq: "monthly"
                            }
                        }
                    },
                    "ポートフォリオ": {
                        url: "/portfolio/",
                        priority: "0.9",
                        changefreq: "monthly",
                        description: "作品ギャラリー、カテゴリ別表示",
                        children: {
                            "作品一覧": {
                                url: "/portfolio/works/",
                                priority: "0.8",
                                changefreq: "monthly"
                            },
                            "作品詳細": {
                                url: "/portfolio/detail/",
                                priority: "0.8",
                                changefreq: "monthly"
                            },
                            "カテゴリ別": {
                                url: "/portfolio/categories/",
                                priority: "0.7",
                                changefreq: "monthly"
                            }
                        }
                    },
                    "サービス": {
                        url: "/services/",
                        priority: "0.8",
                        changefreq: "monthly",
                        description: "提供サービス、料金体系",
                        children: {
                            "サービス内容": {
                                url: "/services/list/",
                                priority: "0.7",
                                changefreq: "monthly"
                            },
                            "料金": {
                                url: "/services/pricing/",
                                priority: "0.8",
                                changefreq: "monthly"
                            },
                            "制作フロー": {
                                url: "/services/process/",
                                priority: "0.7",
                                changefreq: "monthly"
                            }
                        }
                    },
                    "お客様の声": {
                        url: "/testimonials/",
                        priority: "0.7",
                        changefreq: "monthly",
                        description: "クライアントからの推薦・評価"
                    },
                    "ブログ": {
                        url: "/blog/",
                        priority: "0.6",
                        changefreq: "weekly",
                        description: "制作記録、業界情報",
                        children: {
                            "記事一覧": {
                                url: "/blog/posts/",
                                priority: "0.5",
                                changefreq: "weekly"
                            },
                            "記事詳細": {
                                url: "/blog/detail/",
                                priority: "0.5",
                                changefreq: "monthly"
                            }
                        }
                    },
                    "お問い合わせ": {
                        url: "/contact/",
                        priority: "0.8",
                        changefreq: "monthly",
                        description: "制作依頼、相談フォーム",
                        children: {
                            "お問い合わせフォーム": {
                                url: "/contact/form/",
                                priority: "0.8",
                                changefreq: "monthly"
                            },
                            "よくある質問": {
                                url: "/contact/faq/",
                                priority: "0.6",
                                changefreq: "monthly"
                            }
                        }
                    }
                }
            }
        };
    }

    // XML Sitemapテンプレート生成メソッド群
    getCorporateXMLSitemap() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://example.com/about/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://example.com/services/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://example.com/works/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://example.com/news/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://example.com/recruit/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://example.com/contact/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>`;
    }

    getLandingXMLSitemap() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://example.com/privacy/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>https://example.com/legal/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>
</urlset>`;
    }

    getEcommerceXMLSitemap() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://example.com/categories/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://example.com/products/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://example.com/cart/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>always</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://example.com/account/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://example.com/support/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>`;
    }

    getBlogXMLSitemap() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://example.com/posts/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://example.com/categories/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://example.com/tags/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://example.com/archive/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://example.com/profile/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>`;
    }

    getPortfolioXMLSitemap() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://example.com/about/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://example.com/portfolio/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://example.com/services/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://example.com/testimonials/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://example.com/contact/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>`;
    }

    // サイトマップ生成メソッド
    generateSitemap(siteType, format = 'visual', domain = 'https://example.com') {
        const template = this.templates[siteType];
        if (!template) {
            return this.generateDefaultSitemap(format, domain);
        }

        switch (format) {
            case 'visual':
                return this.generateVisualSitemap(template);
            case 'xml':
                return this.generateXMLSitemap(template, domain);
            case 'list':
                return this.generateListSitemap(template);
            default:
                return this.generateVisualSitemap(template);
        }
    }

    // ビジュアルサイトマップ生成
    generateVisualSitemap(template) {
        const structure = template.structure;
        let html = `<div class="sitemap-visual">
            <h3 class="sitemap-title">${template.name}</h3>
            <p class="sitemap-description">${template.description}</p>
            <div class="sitemap-tree">`;
        
        html += this.buildVisualTreeHTML(structure, 0);
        html += '</div></div>';
        
        return html;
    }

    // ビジュアルツリーHTML構築
    buildVisualTreeHTML(node, level) {
        let html = '';
        
        for (const [key, value] of Object.entries(node)) {
            const indent = '  '.repeat(level);
            const hasChildren = value.children || value.sections;
            
            html += `<div class="sitemap-node level-${level}">
                <div class="node-content">
                    <span class="node-icon">${hasChildren ? '📁' : '📄'}</span>
                    <span class="node-title">${key}</span>
                    ${value.url ? `<span class="node-url">${value.url}</span>` : ''}
                    ${value.priority ? `<span class="node-priority">優先度: ${value.priority}</span>` : ''}
                    ${value.description ? `<div class="node-description">${value.description}</div>` : ''}
                </div>`;
            
            if (value.children) {
                html += `<div class="node-children">`;
                html += this.buildVisualTreeHTML(value.children, level + 1);
                html += `</div>`;
            }
            
            if (value.sections) {
                html += `<div class="node-sections">`;
                for (const [sectionKey, sectionValue] of Object.entries(value.sections)) {
                    html += `<div class="sitemap-section level-${level + 1}">
                        <span class="section-icon">🔗</span>
                        <span class="section-title">${sectionKey}</span>
                        ${sectionValue.anchor ? `<span class="section-anchor">${sectionValue.anchor}</span>` : ''}
                        ${sectionValue.description ? `<div class="section-description">${sectionValue.description}</div>` : ''}
                    </div>`;
                }
                html += `</div>`;
            }
            
            html += `</div>`;
        }
        
        return html;
    }

    // XMLサイトマップ生成
    generateXMLSitemap(template, domain) {
        const today = new Date().toISOString().split('T')[0];
        return template.xmlTemplate.replace(/{{TODAY}}/g, today).replace(/https:\/\/example\.com/g, domain);
    }

    // リストサイトマップ生成
    generateListSitemap(template) {
        const structure = template.structure;
        let list = `${template.name} サイトマップ\n`;
        list += `${'='.repeat(template.name.length + 10)}\n\n`;
        list += this.buildListText(structure, 0);
        return list;
    }

    // リストテキスト構築
    buildListText(node, level) {
        let text = '';
        
        for (const [key, value] of Object.entries(node)) {
            const indent = '  '.repeat(level);
            text += `${indent}${level === 0 ? '■' : '・'} ${key}`;
            
            if (value.url) {
                text += ` (${value.url})`;
            }
            
            if (value.priority) {
                text += ` [優先度: ${value.priority}]`;
            }
            
            text += '\n';
            
            if (value.description) {
                text += `${indent}  └ ${value.description}\n`;
            }
            
            if (value.children) {
                text += this.buildListText(value.children, level + 1);
            }
            
            if (value.sections) {
                for (const [sectionKey, sectionValue] of Object.entries(value.sections)) {
                    text += `${indent}  ◆ ${sectionKey}`;
                    if (sectionValue.anchor) {
                        text += ` ${sectionValue.anchor}`;
                    }
                    text += '\n';
                    if (sectionValue.description) {
                        text += `${indent}    └ ${sectionValue.description}\n`;
                    }
                }
            }
        }
        
        return text;
    }

    // デフォルトサイトマップ生成
    generateDefaultSitemap(format, domain) {
        const defaultStructure = {
            "ホーム": {
                url: "/",
                priority: "1.0",
                changefreq: "weekly",
                children: {
                    "サービス": {
                        url: "/services/",
                        priority: "0.8",
                        changefreq: "monthly"
                    },
                    "会社情報": {
                        url: "/about/",
                        priority: "0.7",
                        changefreq: "monthly"
                    },
                    "お問い合わせ": {
                        url: "/contact/",
                        priority: "0.8",
                        changefreq: "monthly"
                    }
                }
            }
        };

        const template = {
            name: "基本サイト構造",
            description: "一般的なWebサイトの基本構造",
            structure: defaultStructure
        };

        switch (format) {
            case 'visual':
                return this.generateVisualSitemap(template);
            case 'xml':
                const xmlTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${domain}/</loc>
        <lastmod>{{TODAY}}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>`;
                const today = new Date().toISOString().split('T')[0];
                return xmlTemplate.replace(/{{TODAY}}/g, today);
            case 'list':
                return this.generateListSitemap(template);
            default:
                return this.generateVisualSitemap(template);
        }
    }

    // サイトタイプ一覧取得
    getSiteTypes() {
        return Object.keys(this.templates).map(key => ({
            key,
            name: this.templates[key].name,
            description: this.templates[key].description
        }));
    }

    // SEOアドバイス生成
    generateSEOAdvice(siteType) {
        const advice = {
            corporate: [
                "企業の信頼性を高めるため、「会社概要」「沿革」ページの優先度を高く設定",
                "お問い合わせフォームはコンバージョンポイントとして重要な位置に配置",
                "実績・事例ページでSEO効果を高める（業界特化キーワード活用）",
                "採用情報は定期更新でフレッシュネスを保つ",
                "SSL化、プライバシーポリシーで信頼性向上"
            ],
            landing: [
                "1ページ構造なのでページ内アンカーリンクを効果的に活用",
                "コンバージョンを妨げる余計なページを削除",
                "プライバシーポリシー、特商法は法的要求から必須",
                "ページ読み込み速度を最重視（画像最適化、CDN活用）",
                "A/Bテストでコンバージョン率改善"
            ],
            ecommerce: [
                "商品ページの更新頻度を「daily」で検索エンジンクロール促進",
                "カテゴリ構造を論理的に整理（パンくずナビ重要）",
                "カート・決済フローの離脱防止（UX重視）",
                "商品レビュー機能でUGC（ユーザー生成コンテンツ）増加",
                "在庫情報、価格情報の構造化データ実装"
            ],
            blog: [
                "記事の更新頻度「daily」で検索エンジン評価向上",
                "カテゴリ・タグ構造でサイト内回遊率向上",
                "関連記事表示でセッション時間延長",
                "RSS配信でリピーター獲得",
                "コメント機能でエンゲージメント向上"
            ],
            portfolio: [
                "作品詳細ページで専門性をアピール",
                "Before/After比較で実力を視覚的に訴求",
                "お客様の声で社会的証明を強化",
                "制作プロセス公開で専門性・透明性アピール",
                "定期的な作品追加でサイトの鮮度を保持"
            ]
        };

        return advice[siteType] || advice.corporate;
    }
}

export default SitemapGenerator;