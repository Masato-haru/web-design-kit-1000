#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

def fix_prompt_strings(json_file):
    """プロンプト文字列を修正"""
    
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    industry_descriptions = {
        "コーポレート": "洗練された印象のコーポレート企業サイトを制作してください。",
        "テック・IT": "モダンでテック・ITらしい革新的なWebサイトを作成してください。",
        "クリエイティブ": "創造性豊かでクリエイティブな印象のWebサイトを制作してください。",
        "ヘルスケア": "安心感と信頼性のあるヘルスケアサイトを制作してください。",
        "ファッション": "スタイリッシュでファッショナブルなWebサイトを制作してください。",
        "食品・飲食": "美味しそうで食欲をそそる飲食店サイトを制作してください。",
        "教育": "学習意欲を高める教育機関サイトを制作してください。",
        "不動産": "信頼感と安定感のある不動産サイトを制作してください。",
        "エンターテイメント": "楽しく魅力的なエンターテイメントサイトを制作してください。",
        "金融": "堅実で信頼性の高い金融サービスサイトを制作してください。"
    }
    
    print("=== プロンプト修正 ===")
    
    for kit in data['kit_data']:
        industry = kit['industry']
        colors = kit['color_palette']
        heading_font = kit['fonts']['heading']
        body_font = kit['fonts']['body']
        
        # 正しいプロンプト文字列を生成
        colors_str = "、".join(colors)
        new_prompt = f"{industry_descriptions[industry]}カラーパレット：{colors_str}、フォント：見出し「{heading_font}」本文「{body_font}」"
        
        kit['vibe_coding_prompt'] = new_prompt
    
    # ファイルに保存
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("プロンプト修正完了")

if __name__ == "__main__":
    fix_prompt_strings('web_design_kit_1000.json')