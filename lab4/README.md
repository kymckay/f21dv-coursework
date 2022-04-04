## Data sources

- The birth names for England and Wales are sourced from the Office for National Statistics licensed under the Open Government Licence.
- The birth names for Scotland are sourced from the National Records of Scotland under the Open Government Licence.

## Data processing

All data processing was done using custom Python scripts with the
standard library's csv module.

I extracted the data for England and Wales from the .xls file format
and cleaned it to remove numerical localization and placeholder values.
I converted the rank and count of each name from a wide to tall format
to match the Scottish data.

I trimmed the data for Scotland to removes names with a count of 2 or
less to preserve individual privacy (matching the processing used by the
ONS). I also removed data for years pre-1996 to align with the England
and Wales data.
