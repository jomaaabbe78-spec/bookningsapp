import os

def test_readme_spelling():
    readme_path = 'README.md'
    assert os.path.exists(readme_path), 'README.md must exist'
    with open(readme_path, 'r', encoding='utf-8') as f:
        content = f.read()
    assert 'Welcom ' not in content, 'Typo Welcom found in README.md'
    assert 'Welcome' in content, 'Welcome word should be present in README.md'
