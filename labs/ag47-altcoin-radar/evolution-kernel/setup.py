from setuptools import setup, find_packages

setup(
    name="evolution_kernel",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "jsonschema>=4.0.0",
    ],
    entry_points={
        "console_scripts": [
            "evolution=evolution_kernel.cli.main:main",
        ],
    },
)
