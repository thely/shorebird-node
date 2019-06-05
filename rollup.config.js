import scss from 'rollup-plugin-scss';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import dotenvPlugin from 'rollup-plugin-dotenv';
import builtins from 'rollup-plugin-node-builtins';

export default {
	input: 'src/js/main.js',
	output: {
		file: 'public/bundle.js',
		format: 'iife',
		sourcemap: true
	},
	plugins: [
		commonjs({
			namedExports: {
				'node_modules/standardized-audio-context/build/es5/bundle.js': ['AudioContext'],
				'node_modules/sample-manager/index.js': ['SampleManager'],
				'node_modules/p5/lib/p5.min.js': ['p5'],
			},
		}),
		scss({
			output: 'public/style.css'
		}),
		resolve({
			mainFields: ['main'],
		}),
		dotenvPlugin(),
		builtins()
	]
}