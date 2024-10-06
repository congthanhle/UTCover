import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface TestResult {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testResults: TestSuiteResult[];
}

interface TestSuiteResult {
  name: string;
  status: 'passed' | 'failed';
  duration: number;
  assertionResults: AssertionResult[];
}

interface AssertionResult {
  title: string;
  status: 'passed' | 'failed';
  duration: number;
  failureMessages?: string[];
}

class ExternalTestRunner {
  private projectPath: string;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
  }

  private async readPackageJson(): Promise<PackageJson> {
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    console.log('Reading package.json from', packageJsonPath);
    
    try {
      const packageJsonContent = await fs.promises.readFile(packageJsonPath, 'utf-8');
      return JSON.parse(packageJsonContent) as PackageJson;
    } catch (error) {
      throw new Error(`Failed to read package.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async detectTestFramework(): Promise<string> {
    const packageJson = await this.readPackageJson();
    
    const allDependencies = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {})
    };
    
    if ('jest' in allDependencies) return 'jest';
    if ('mocha' in allDependencies) return 'mocha';
    if ('vitest' in allDependencies) return 'vitest';
    
    throw new Error('No supported test framework found');
  }

  async runTests(): Promise<TestResult> {
    const framework = await this.detectTestFramework();
    
    return new Promise((resolve, reject) => {
      let testCommand: string;
      switch (framework) {
        case 'jest':
          testCommand = 'jest';
          break;
        case 'mocha':
          testCommand = 'mocha';
          break;
        case 'vitest':
          testCommand = 'vitest';
          break;
        default:
          reject(new Error(`Unsupported test framework: ${framework}`));
          return;
      }

      const testProcess = spawn('npx', [testCommand, '--json'], {
        cwd: this.projectPath,
        shell: true
      });

      let outputData = '';
      let errorData = '';

      testProcess.stdout.on('data', (data: Buffer) => {
        outputData += data.toString();
      });

      testProcess.stderr.on('data', (data: Buffer) => {
        errorData += data.toString();
      });

      testProcess.on('close', (code: number) => {
        if (code !== 0) {
          reject(new Error(`Test process exited with code ${code}\n${errorData}`));
          return;
        }

        try {
          const results = JSON.parse(outputData);
          resolve(this.formatResults(results, framework));
        } catch (error) {
          reject(new Error(`Failed to parse test results: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      });
    });
  }

  private formatResults(results: any, framework: string): TestResult {
    switch (framework) {
      case 'jest':
        return this.formatJestResults(results);
      case 'mocha':
        return this.formatMochaResults(results);
      case 'vitest':
        return this.formatVitestResults(results);
      default:
        throw new Error(`Unsupported test framework: ${framework}`);
    }
  }

  private formatJestResults(results: any): TestResult {
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

  private formatMochaResults(results: any): TestResult {
    // Implement Mocha-specific formatting
    throw new Error('Mocha formatting not implemented');
  }

  private formatVitestResults(results: any): TestResult {
    // Implement Vitest-specific formatting
    throw new Error('Vitest formatting not implemented');
  }
}

export default ExternalTestRunner;