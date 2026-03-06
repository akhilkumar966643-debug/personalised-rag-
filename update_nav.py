import glob
import re

nav_links = '''    <ul class="nav-links">
      <li><a href="index.html" class="nav-link"><i class="fa-solid fa-chart-pie"></i> Dashboard</a></li>
      <li><a href="subjects.html" class="nav-link"><i class="fa-solid fa-book"></i> Subjects</a></li>
      <li><a href="curriculum.html" class="nav-link"><i class="fa-solid fa-map"></i> Curriculum</a></li>
      <li><a href="tutor.html" class="nav-link"><i class="fa-solid fa-robot"></i> AI Tutor</a></li>
      <li><a href="jam.html" class="nav-link"><i class="fa-solid fa-users"></i> Group Jam</a></li>
      <li><a href="quiz.html" class="nav-link"><i class="fa-solid fa-list-check"></i> Practice Quiz</a></li>
      <li><a href="graph.html" class="nav-link"><i class="fa-solid fa-project-diagram"></i> Knowledge Graph</a></li>
      <li><a href="profile.html" class="nav-link"><i class="fa-solid fa-database"></i> Data Hub</a></li>
    </ul>'''

for fname in glob.glob('*.html'):
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the ul block
    new_content = re.sub(r'<ul class=\"nav-links\">.*?</ul>', nav_links, content, flags=re.DOTALL)
    
    # Re-apply active class based on filename
    base = fname.split('.')[0]
    if base != 'index':
        new_content = new_content.replace(f'href="{fname}" class="nav-link"', f'href="{fname}" class="nav-link active"')
    else:
        new_content = new_content.replace(f'href="index.html" class="nav-link"', f'href="index.html" class="nav-link active"')
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(new_content)
print('Updated all navs.')
