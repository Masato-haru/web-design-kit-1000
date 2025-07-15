#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import random
import colorsys
from collections import defaultdict

class UniqueColorPaletteGenerator:
    def __init__(self):
        self.generated_palettes = set()
        self.industry_base_colors = {
            "コーポレート": [(0.6, 0.4, 0.4), (0.75, 0.3, 0.7)],  # ブルー系
            "テック・IT": [(0.75, 0.6, 0.3), (0.8, 0.8, 0.6)],   # パープル・ブルー
            "クリエイティブ": [(0.1, 0.8, 0.6), (0.9, 0.7, 0.5)], # 鮮やか
            "ヘルスケア": [(0.33, 0.6, 0.4), (0.4, 0.5, 0.7)],   # グリーン系
            "ファッション": [(0.95, 0.7, 0.5), (0.1, 0.6, 0.6)], # ピンク・レッド
            "食品・飲食": [(0.05, 0.8, 0.6), (0.1, 0.9, 0.7)],  # オレンジ・レッド
            "教育": [(0.55, 0.5, 0.5), (0.65, 0.6, 0.7)],        # ブルー系
            "不動産": [(0.25, 0.4, 0.5), (0.15, 0.6, 0.4)],      # アース系
            "エンターテイメント": [(0.8, 0.8, 0.6), (0.2, 0.9, 0.7)], # 多彩
            "金融": [(0.65, 0.3, 0.3), (0.7, 0.4, 0.5)]          # ダーク系
        }
    
    def hsv_to_hex(self, h, s, v):
        """HSVからHEXに変換"""
        rgb = colorsys.hsv_to_rgb(h, s, v)
        return '#{:02x}{:02x}{:02x}'.format(
            int(rgb[0] * 255),
            int(rgb[1] * 255),
            int(rgb[2] * 255)
        ).upper()
    
    def generate_unique_palette(self, industry, attempt=0):
        """業種に適したユニークなカラーパレットを生成"""
        if attempt > 100:  # 無限ループ防止
            # フォールバック：完全ランダム
            palette = [
                self.hsv_to_hex(random.random(), random.uniform(0.3, 1.0), random.uniform(0.3, 1.0))
                for _ in range(4)
            ]
        else:
            base_colors = self.industry_base_colors.get(industry, [(0.6, 0.5, 0.5), (0.8, 0.6, 0.7)])
            
            # メインカラー
            main_base = random.choice(base_colors)
            main_h = main_base[0] + random.uniform(-0.1, 0.1)
            main_s = max(0.3, min(1.0, main_base[1] + random.uniform(-0.2, 0.2)))
            main_v = max(0.3, min(1.0, main_base[2] + random.uniform(-0.2, 0.2)))
            main_color = self.hsv_to_hex(main_h % 1.0, main_s, main_v)
            
            # アクセントカラー（補色系）
            accent_h = (main_h + random.uniform(0.3, 0.7)) % 1.0
            accent_s = random.uniform(0.5, 1.0)
            accent_v = random.uniform(0.4, 0.8)
            accent_color = self.hsv_to_hex(accent_h, accent_s, accent_v)
            
            # 明るいカラー（背景系）
            light_h = main_h + random.uniform(-0.05, 0.05)
            light_s = random.uniform(0.1, 0.3)
            light_v = random.uniform(0.85, 0.95)
            light_color = self.hsv_to_hex(light_h % 1.0, light_s, light_v)
            
            # ダークカラー（テキスト系）
            dark_h = main_h + random.uniform(-0.1, 0.1)
            dark_s = random.uniform(0.2, 0.6)
            dark_v = random.uniform(0.15, 0.4)
            dark_color = self.hsv_to_hex(dark_h % 1.0, dark_s, dark_v)
            
            palette = [main_color, accent_color, light_color, dark_color]
        
        # 同じ色が4つあるかチェック
        unique_colors = set(palette)
        if len(unique_colors) == 1:
            return self.generate_unique_palette(industry, attempt + 1)
        
        # パレットの重複チェック
        palette_tuple = tuple(sorted(palette))
        if palette_tuple in self.generated_palettes:
            return self.generate_unique_palette(industry, attempt + 1)
        
        self.generated_palettes.add(palette_tuple)
        return palette
    
    def update_json_data(self, input_file, output_file):
        """JSONデータのカラーパレットを更新"""
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 業種別にKITをグループ化
        industry_kits = defaultdict(list)
        for kit in data['kit_data']:
            industry_kits[kit['industry']].append(kit)
        
        print("=== カラーパレット更新 ===")
        
        # 各業種のKITを更新
        for industry, kits in industry_kits.items():
            print(f"{industry}: {len(kits)}個のKITを更新中...")
            for kit in kits:
                new_palette = self.generate_unique_palette(industry)
                kit['color_palette'] = new_palette
                
                # プロンプトも更新
                colors_str = "、".join(new_palette)
                kit['vibe_coding_prompt'] = kit['vibe_coding_prompt'].split('カラーパレット：')[0] + f"カラーパレット：{colors_str}、" + "、".join(kit['vibe_coding_prompt'].split('、')[4:])
        
        # ファイルに保存
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"更新完了: {len(self.generated_palettes)}個のユニークパレットを生成")
        print(f"出力ファイル: {output_file}")

if __name__ == "__main__":
    generator = UniqueColorPaletteGenerator()
    generator.update_json_data('web_design_kit_1000.json', 'web_design_kit_1000_updated.json')