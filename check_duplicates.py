#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from collections import Counter

def check_duplicate_palettes(json_file):
    """カラーパレットの重複をチェックし、4色全て同じパレットを特定する"""
    
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # パレットをタプルに変換して重複チェック
    palette_counts = Counter()
    palette_to_ids = {}
    same_color_palettes = []
    
    for kit in data['kit_data']:
        palette = tuple(sorted(kit['color_palette']))  # ソートして順序を統一
        palette_counts[palette] += 1
        
        if palette not in palette_to_ids:
            palette_to_ids[palette] = []
        palette_to_ids[palette].append(kit['id'])
        
        # 4色全て同じかチェック
        unique_colors = set(kit['color_palette'])
        if len(unique_colors) == 1:
            same_color_palettes.append({
                'id': kit['id'],
                'industry': kit['industry'],
                'color': kit['color_palette'][0]
            })
    
    print("=== 4色全て同じカラーパレット ===")
    if same_color_palettes:
        for item in same_color_palettes:
            print(f"ID {item['id']}: {item['industry']} - 全て {item['color']}")
    else:
        print("4色全て同じカラーパレットはありません。")
    
    print(f"\n=== 重複パレット（2回以上使用） ===")
    duplicates = {palette: count for palette, count in palette_counts.items() if count > 1}
    
    if duplicates:
        for palette, count in duplicates.items():
            ids = palette_to_ids[palette]
            print(f"パレット {list(palette)}: {count}回使用 (ID: {ids})")
    else:
        print("重複パレットはありません。")
    
    print(f"\n=== 統計 ===")
    print(f"総KIT数: {len(data['kit_data'])}")
    print(f"ユニークパレット数: {len(palette_counts)}")
    print(f"4色同一パレット数: {len(same_color_palettes)}")
    print(f"重複パレット数: {len(duplicates)}")
    
    return same_color_palettes, duplicates

if __name__ == "__main__":
    same_color, duplicates = check_duplicate_palettes('web_design_kit_1000.json')