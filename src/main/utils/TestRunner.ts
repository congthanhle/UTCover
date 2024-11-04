import { spawn } from 'child_process';
const path = require('path');
const fs = require('fs');

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

interface TestResult {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testResults: Array<{
    name: string;
    status: 'passed' | 'failed';
    duration: number;
    assertionResults: Array<{
      title: string;
      status: 'passed' | 'failed';
      duration: number;
      failureMessages?: string[];
    }>;
  }>;
}

class ExternalTestRunner {
  private projectPath: string;
  private outputCallback?: (data: string) => void;
  private errorCallback?: (data: string) => void;

  constructor(
    projectPath: string, 
    outputCallback?: (data: string) => void,
    errorCallback?: (data: string) => void
  ) {
    this.projectPath = projectPath;
    this.outputCallback = outputCallback;
    this.errorCallback = errorCallback;
  }

  private async readPackageJson(): Promise<PackageJson> {
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    try {
      // Sử dụng fs.promises để đọc file
      const packageJsonContent = await fs.promises.readFile(packageJsonPath, 'utf-8');
      this.log('Package.json loaded successfully');
      return JSON.parse(packageJsonContent) as PackageJson;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.error(`Failed to read package.json: ${errorMessage}`);
      throw new Error(`Failed to read package.json: ${errorMessage}`);
    }
  }

  private async getTestCommand(framework: string): Promise<string[]> {
    const packageJson = await this.readPackageJson();
    const scripts = packageJson.scripts || {};

    switch (framework) {
      case 'jest':
        return ['npx', 'jest', '--json'];
      case 'mocha':
        // Tìm script test:unit trong package.json
        const mochaScript = scripts['test:unit'];
        if (mochaScript) {
          return ['npm', 'run', 'test:unit', '--', '--reporter', 'json'];
        }
        return ['npx', 'mocha', '--reporter', 'json'];
      case 'vitest':
        return ['npx', 'vitest', 'run', '--reporter', 'json'];
      default:
        throw new Error(`Unsupported test framework: ${framework}`);
    }
  }

  async detectTestFramework(): Promise<string> {
    this.log('Detecting test framework...');
    const packageJson = await this.readPackageJson();
    
    const allDependencies = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {})
    };

    // Kiểm tra cả scripts để phát hiện framework
    const scripts = packageJson.scripts || {};
    const scriptContent = Object.values(scripts).join(' ').toLowerCase();
    
    if ('jest' in allDependencies || scriptContent.includes('jest')) {
      this.log('Detected Jest framework');
      return 'jest';
    }
    if ('@types/mocha' in allDependencies || scriptContent.includes('mocha')) {
      this.log('Detected Mocha framework');
      return 'mocha';
    }
    if ('vitest' in allDependencies || scriptContent.includes('vitest')) {
      this.log('Detected Vitest framework');
      return 'vitest';
    }
    
    throw new Error('No supported test framework found');
  }

  async runTests(options: {
    env?: NodeJS.ProcessEnv;
    timeout?: number;
  } = {}): Promise<TestResult> {
    this.log('Running tests...');
    const framework = await this.detectTestFramework();
    const command = await this.getTestCommand(framework);
    
    return new Promise((resolve, reject) => {
      // Merge environment variables
      const env = {
        ...process.env,
        NODE_ENV: 'test',
        NODE_OPTIONS: '--max-old-space-size=8192',
        ...options.env
      };

      this.log(`Executing command: ${command.join(' ')}`);
      const testProcess = spawn(command[0], command.slice(1), {
        cwd: this.projectPath,
        env,
        shell: true
      });

      let outputData = '';
      let errorData = '';

      // Set timeout if specified
      let timeoutId: NodeJS.Timeout | undefined;
      if (options.timeout) {
        timeoutId = setTimeout(() => {
          testProcess.kill();
          reject(new Error(`Test execution timed out after ${options.timeout}ms`));
        }, options.timeout);
      }

      testProcess.stdout.on('data', (data: Buffer) => {
        const output = data.toString();
        outputData += output;
        this.log(output);
      });

      testProcess.stderr.on('data', (data: Buffer) => {
        const error = data.toString();
        errorData += error;
        this.error(error);
      });

      testProcess.on('close', (code: number) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        this.log(`Test process exited with code: ${code}`);
        
        if (code !== 0 && !this.isIgnorableError(errorData)) {
          reject(new Error(`Test process exited with code ${code}\n${errorData}`));
          return;
        }

        try {
          const result = this.formatResults(outputData, framework);
          this.log('Tests completed successfully');
          console.log('12. Test results: ', result);
          resolve(result);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          reject(new Error(`Failed to parse test results: ${errorMessage}`));
        }
      });
    });
  }

  private isIgnorableError(error: string): boolean {
    const ignorablePatterns = [
      'Browserslist',
      'DeprecationWarning',
      'ExperimentalWarning',
      'webpack performance recommendations'
    ];
    return ignorablePatterns.some(pattern => error.includes(pattern));
  }

  private log(message: string) {
    this.outputCallback?.(message);
    console.log(message);
  }

  private error(message: string) {
    this.errorCallback?.(message);
    console.error(message);
  }

  private formatResults(results: string, framework: string): TestResult {
    this.log(`Formatting results for ${framework}`);
    try {
      const parsedResults = JSON.parse(results);
      switch (framework) {
        case 'jest':
          return this.formatJestResults(parsedResults);
        case 'mocha':
          return this.formatMochaResults(parsedResults);
        case 'vitest':
          return this.formatVitestResults(parsedResults);
        default:
          throw new Error(`Unsupported test framework: ${framework}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to parse test results: ${errorMessage}\nRaw results: ${results}`);
    }
  }

  private formatJestResults(results: any): TestResult {
    console.log('13. Formatting Jest results');
    return {
      totalTests: results.numTotalTests,
      passedTests: results.numPassedTests,
      failedTests: results.numFailedTests,
      testResults: results.testResults.map((suite: any) => ({
        name: suite.name,
        status: suite.status as 'passed' | 'failed',
        duration: suite.duration,
        assertionResults: suite.assertionResults.map((test: any) => ({
          title: test.title,
          status: test.status as 'passed' | 'failed',
          duration: test.duration,
          failureMessages: test.failureMessages
        }))
      }))
    };
  }

  private formatMochaResults(results: string): TestResult {
    console.log('14. Formatting Mocha results');
    try {
      // Parse JSON output từ Mocha
      const mochaResults = JSON.parse(results);
      
      // Tính toán tổng số test
      const totalTests = this.calculateTotalTests(mochaResults);
      const passedTests = this.calculatePassedTests(mochaResults);
      const failedTests = totalTests - passedTests;
  
      // Format kết quả theo interface TestResult
      return {
        totalTests,
        passedTests,
        failedTests,
        testResults: this.transformMochaSuites(mochaResults.suites)
      };
    } catch (error) {
      console.error('Error parsing Mocha results:', error);
      throw error;
    }
  }
  
  private calculateTotalTests(results: any): number {
    let total = 0;
    const countTests = (suite: any) => {
      if (suite.tests) {
        total += suite.tests.length;
      }
      if (suite.suites) {
        suite.suites.forEach(countTests);
      }
    };
    results.suites.forEach(countTests);
    return total;
  }
  
  private calculatePassedTests(results: any): number {
    let passed = 0;
    const countPassed = (suite: any) => {
      if (suite.tests) {
        passed += suite.tests.filter((test: any) => test.state === 'passed').length;
      }
      if (suite.suites) {
        suite.suites.forEach(countPassed);
      }
    };
    results.suites.forEach(countPassed);
    return passed;
  }
  
  private transformMochaSuites(suites: any[]): any[] {
    return suites.map(suite => ({
      name: suite.title,
      status: this.getSuiteStatus(suite),
      duration: suite.duration || 0,
      assertionResults: this.transformMochaTests(suite.tests || []),
      // Recursively transform nested suites
      suites: suite.suites ? this.transformMochaSuites(suite.suites) : []
    }));
  }
  
  private transformMochaTests(tests: any[]): any[] {
    return tests.map(test => ({
      title: test.title,
      status: test.state === 'passed' ? 'passed' : 'failed',
      duration: test.duration || 0,
      failureMessages: test.err ? [test.err.message] : []
    }));
  }
  
  private getSuiteStatus(suite: any): 'passed' | 'failed' {
    const hasFailedTests = (suite: any): boolean => {
      if (suite.tests && suite.tests.some((test: any) => test.state === 'failed')) {
        return true;
      }
      if (suite.suites) {
        return suite.suites.some(hasFailedTests);
      }
      return false;
    };
    
    return hasFailedTests(suite) ? 'failed' : 'passed';
  }

  private formatVitestResults(results: any): TestResult {
    console.log('15. Formatting Vitest results');
    throw new Error('Vitest formatting not implemented');
  }
}

export default ExternalTestRunner;
