import * as moment from 'moment';

export function formatDuration(time: Date, compact: boolean) {
  const timeValue = moment().diff(time);
  let result = '';
  const duration = moment.duration(timeValue);
  const suffixes = ['d', 'h', 'm'];
  const durationValues = [
    Math.round(duration.asDays()),
    duration.hours(),
    duration.minutes(),
  ];
  durationValues.forEach((value, index) => {
    if (value) {
      result += value + suffixes[index] + ' ';
    }
  });
  if (compact) {
    result = result.split(' ')[0];
  }
  if (!result) {
    return '<1m';
  }
  return result;
}

export function generateNameFunction() {
  const length = 4,
    charset = '123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return 'functions-' + retVal;
}

const NEWLINE = '\n';
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_NEWLINES = /\\n/g;
const NEWLINES_MATCH = /\n|\r|\r\n/;

// Parses src into an Object
export function parsesObject(src /*: string | Buffer */ /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {

  const obj: {
    name: string,
    value: string,
  } [] = [];

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL);
    // matched?
    if (keyValueArr != null) {
      const name = keyValueArr[1];
      // default undefined or missing values to empty string
      let value = (keyValueArr[2] || '');
      const end = value.length - 1;
      const isDoubleQuoted = value[0] === '"' && value[end] === '"';
      const isSingleQuoted = value[0] === '\'' && value[end] === '\'';

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        value = value.substring(1, end);

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          value = value.replace(RE_NEWLINES, NEWLINE);
        }
      } else {
        // remove surrounding whitespace
        value = value.trim();
      }

      obj.push({name, value});
    }
  });

  return obj;
}

