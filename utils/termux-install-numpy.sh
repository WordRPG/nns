# Install numpy on termux.
# Original Source: https://github.com/termux/termux-packages/discussions/19126
source env/bin/activate
yes | pkg upgrade
pkg install python build-essential cmake ninja libopenblas libandroid-execinfo patchelf binutils-is-llvm
pip3 install setuptools wheel packaging pyproject_metadata cython meson-python versioneer
python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")'
MATHLIB=m LDFLAGS="-lpython3.12" pip3 install --no-build-isolation --no-cache-dir numpy
LDFLAGS="-lpython3.12" pip3 install --no-build-isolation --no-cache-dir pandas



