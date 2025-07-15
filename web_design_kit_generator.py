import json
import random
from typing import List, Dict, Tuple

class WebDesignKitGenerator:
    """Web制作KIT自動生成クラス"""
    
    def __init__(self):
        # 業種別カラーパレット設計
        self.industry_color_schemes = {
            "コーポレート": [
                ["#2E3A87", "#FFFFFF", "#F5F5F5", "#666666"],
                ["#1B365D", "#4A90A4", "#87CEEB", "#F0F8FF"],
                ["#2C3E50", "#3498DB", "#ECF0F1", "#34495E"],
                ["#0F4C75", "#3282B8", "#BBE1FA", "#0E3047"],
                ["#2C5F2D", "#97BC62", "#F5F8DC", "#1A3E1C"]
            ],
            "テック・IT": [
                ["#0A84FF", "#1D1D1F", "#F2F2F7", "#8E8E93"],
                ["#6366F1", "#1E293B", "#F8FAFC", "#475569"],
                ["#8B5CF6", "#111827", "#F9FAFB", "#374151"],
                ["#06B6D4", "#0F172A", "#F0F9FF", "#0369A1"],
                ["#10B981", "#064E3B", "#ECFDF5", "#047857"]
            ],
            "クリエイティブ": [
                ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"],
                ["#E74C3C", "#F39C12", "#9B59B6", "#2ECC71"],
                ["#FF5722", "#FF9800", "#795548", "#607D8B"],
                ["#E91E63", "#9C27B0", "#673AB7", "#3F51B5"],
                ["#F44336", "#FF5722", "#FF9800", "#FFC107"]
            ],
            "ヘルスケア": [
                ["#2ECC71", "#27AE60", "#E8F8F5", "#1B4332"],
                ["#3498DB", "#2980B9", "#EBF5FB", "#1B2631"],
                ["#52C41A", "#389E0D", "#F6FFED", "#092B00"],
                ["#1890FF", "#096DD9", "#E6F7FF", "#002766"],
                ["#73D13D", "#52C41A", "#F6FFED", "#135200"]
            ],
            "ファッション": [
                ["#E91E63", "#FCE4EC", "#880E4F", "#F8BBD9"],
                ["#9C27B0", "#F3E5F5", "#4A148C", "#CE93D8"],
                ["#FF5722", "#FBE9E7", "#BF360C", "#FFAB91"],
                ["#FF6F00", "#FFF3E0", "#E65100", "#FFB74D"],
                ["#8BC34A", "#F1F8E9", "#33691E", "#AED581"]
            ],
            "食品・飲食": [
                ["#FF6B35", "#F7931E", "#FFD23F", "#06FFA5"],
                ["#FF4757", "#FFA502", "#2ED573", "#F8F8F8"],
                ["#D63031", "#FDCB6E", "#00B894", "#DDD"],
                ["#FF3838", "#FF9F43", "#10AC84", "#F1F2F6"],
                ["#E17055", "#FDCB6E", "#00CEC9", "#636E72"]
            ],
            "教育": [
                ["#3742FA", "#2F3542", "#A4B0BE", "#F1F2F6"],
                ["#5352ED", "#40407A", "#C8D6E5", "#F8F9FA"],
                ["#3C40C6", "#2C2C54", "#8395A7", "#F1F2F6"],
                ["#00A8FF", "#0058B3", "#B8E6FF", "#F4F4F4"],
                ["#4834D4", "#2C2C54", "#DDD6FE", "#F8F9FA"]
            ],
            "不動産": [
                ["#8B4513", "#D2B48C", "#F5DEB3", "#2F1B14"],
                ["#A0522D", "#DEB887", "#F5F5DC", "#654321"],
                ["#CD853F", "#F4A460", "#FFF8DC", "#8B4513"],
                ["#B8860B", "#DAA520", "#FFFACD", "#556B2F"],
                ["#228B22", "#90EE90", "#F0FFF0", "#006400"]
            ],
            "エンターテイメント": [
                ["#FF0080", "#00FFFF", "#FFFF00", "#8A2BE2"],
                ["#FF1493", "#00CED1", "#FFD700", "#9370DB"],
                ["#DC143C", "#00BFFF", "#ADFF2F", "#BA55D3"],
                ["#FF4500", "#1E90FF", "#32CD32", "#9932CC"],
                ["#FF6347", "#40E0D0", "#FFFF00", "#8B008B"]
            ],
            "金融": [
                ["#1565C0", "#0D47A1", "#E3F2FD", "#424242"],
                ["#2E7D32", "#1B5E20", "#E8F5E8", "#37474F"],
                ["#AD1457", "#880E4F", "#FCE4EC", "#424242"],
                ["#5D4037", "#3E2723", "#EFEBE9", "#424242"],
                ["#455A64", "#263238", "#ECEFF1", "#212121"]
            ]
        }
        
        # 日本語対応Google Fonts
        self.japanese_fonts = {
            "見出し用": [
                "Noto Sans JP", "Noto Serif JP", "M PLUS 1p", "M PLUS Rounded 1c",
                "Sawarabi Gothic", "Sawarabi Mincho", "Kosugi", "Kosugi Maru",
                "Kiwi Maru", "Hachi Maru Pop", "New Tegomin", "Yusei Magic",
                "BIZ UDPGothic", "BIZ UDPMincho", "Zen Kaku Gothic New", "Zen Kaku Gothic Antique",
                "Zen Maru Gothic", "Zen Old Mincho", "Murecho", "Stick",
                "Rampart One", "Reggae One", "RocknRoll One", "Mochiy Pop One",
                "Mochiy Pop P One", "Kaisei Tokumin", "Kaisei Opti", "Kaisei HarunoUmi",
                "Kaisei Decol", "Shippori Mincho", "Shippori Mincho B1", "Shippori Antique",
                "Shippori Antique B1", "Potta One", "Train One", "DotGothic16",
                "Dela Gothic One", "Yomogi", "Klee One", "Hina Mincho"
            ],
            "本文用": [
                "Noto Sans JP", "Noto Serif JP", "M PLUS 1p", "Sawarabi Gothic",
                "Sawarabi Mincho", "Kosugi", "BIZ UDPGothic", "BIZ UDPMincho",
                "Zen Kaku Gothic New", "Zen Maru Gothic", "Zen Old Mincho", "Murecho",
                "Kaisei Tokumin", "Kaisei Opti", "Shippori Mincho", "Shippori Mincho B1",
                "Klee One", "Hina Mincho", "M PLUS 1", "M PLUS 2",
                "IBM Plex Sans JP", "Source Han Sans", "Hiragino Sans", "Yu Gothic",
                "Meiryo", "MS Gothic", "Crimson Pro", "Lora", "Source Sans Pro",
                "Open Sans", "Roboto", "Lato", "Montserrat", "Poppins",
                "Inter", "Nunito", "Raleway", "Work Sans", "Fira Sans",
                "Rubik", "DM Sans", "Manrope", "Plus Jakarta Sans"
            ]
        }
        
        # VibeCoding用プロンプトテンプレート
        self.prompt_templates = [
            "モダンで{industry}らしい{vibe}なWebサイトを作成してください。カラーパレット：{colors}、フォント：見出し「{heading_font}」本文「{body_font}」",
            "{industry}業界向けの{vibe}で{style}なランディングページを設計してください。指定カラー：{colors}、タイポグラフィ：「{heading_font}」「{body_font}」",
            "{vibe}な印象の{industry}企業サイトを制作してください。ブランドカラー：{colors}、フォントペア：{heading_font}+{body_font}",
            "{industry}らしい{vibe}で{style}なWebデザインを生成してください。カラースキーム：{colors}、見出し：{heading_font}、本文：{body_font}",
            "{style}で{vibe}な{industry}向けWebサイトを作ってください。推奨カラー：{colors}、推奨フォント：{heading_font}（見出し）{body_font}（本文）"
        ]
        
        self.vibes = ["洗練された", "親しみやすい", "プロフェッショナルな", "創造的な", "信頼感のある", "革新的な", "エレガントな", "力強い"]
        self.styles = ["ミニマル", "カラフル", "シンプル", "モダン", "クラシック", "トレンド感溢れる", "高級感のある", "親近感のある"]

    def generate_color_palette(self, industry: str) -> List[str]:
        """業種に応じたカラーパレットを生成"""
        if industry in self.industry_color_schemes:
            base_schemes = self.industry_color_schemes[industry]
            return random.choice(base_schemes)
        else:
            # デフォルトのランダムパレット
            return ["#" + "".join([random.choice("0123456789ABCDEF") for _ in range(6)]) for _ in range(4)]

    def generate_font_pair(self) -> Tuple[str, str]:
        """見出し用と本文用フォントのペアを生成"""
        heading_font = random.choice(self.japanese_fonts["見出し用"])
        body_font = random.choice(self.japanese_fonts["本文用"])
        return heading_font, body_font

    def generate_prompt(self, industry: str, colors: List[str], heading_font: str, body_font: str) -> str:
        """VibeCoding用プロンプトを生成"""
        template = random.choice(self.prompt_templates)
        vibe = random.choice(self.vibes)
        style = random.choice(self.styles)
        
        return template.format(
            industry=industry,
            vibe=vibe,
            style=style,
            colors="、".join(colors),
            heading_font=heading_font,
            body_font=body_font
        )

    def generate_web_design_kit(self, count: int = 1000) -> List[Dict]:
        """1000通りのWeb制作KITを生成"""
        kit_data = []
        industries = list(self.industry_color_schemes.keys())
        
        for i in range(count):
            # 業種をローテーション
            industry = industries[i % len(industries)]
            
            # カラーパレット生成
            colors = self.generate_color_palette(industry)
            
            # フォントペア生成
            heading_font, body_font = self.generate_font_pair()
            
            # プロンプト生成
            prompt = self.generate_prompt(industry, colors, heading_font, body_font)
            
            kit_item = {
                "id": i + 1,
                "industry": industry,
                "color_palette": colors,
                "fonts": {
                    "heading": heading_font,
                    "body": body_font
                },
                "vibe_coding_prompt": prompt
            }
            
            kit_data.append(kit_item)
        
        return kit_data

def main():
    """メイン実行関数"""
    generator = WebDesignKitGenerator()
    web_design_kit = generator.generate_web_design_kit(1000)
    
    # JSON形式で出力
    output_data = {
        "title": "Web制作KIT 1000選",
        "description": "業種別カラーパレット+日本語フォント組み合わせとVibeCodingプロンプト集",
        "total_count": len(web_design_kit),
        "generated_date": "2025-07-13",
        "categories": list(generator.industry_color_schemes.keys()),
        "kit_data": web_design_kit
    }
    
    # ファイルに保存
    with open("/Users/kuritamasato/Downloads/Ai WebデザインKIT/web_design_kit_1000.json", "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"Web制作KIT {len(web_design_kit)}選を生成しました！")
    print("保存先: web_design_kit_1000.json")
    
    # サンプル表示
    print("\n=== サンプル表示（最初の3件） ===")
    for item in web_design_kit[:3]:
        print(f"\nID: {item['id']}")
        print(f"業種: {item['industry']}")
        print(f"カラーパレット: {item['color_palette']}")
        print(f"フォント: 見出し「{item['fonts']['heading']}」/ 本文「{item['fonts']['body']}」")
        print(f"プロンプト: {item['vibe_coding_prompt']}")

if __name__ == "__main__":
    main()