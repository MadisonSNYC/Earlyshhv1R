
// Bundle analysis and optimization utilities
export interface BundleInfo {
  chunkName: string;
  size: number;
  modules: string[];
  loadTime?: number;
}

export class BundleAnalyzer {
  private static chunks: Map<string, BundleInfo> = new Map();

  static trackChunkLoad(chunkName: string, modules: string[], loadTime: number) {
    const size = this.estimateChunkSize(modules);
    
    this.chunks.set(chunkName, {
      chunkName,
      size,
      modules,
      loadTime
    });

    // Report slow chunks
    if (loadTime > 1000) {
      console.warn(`Slow chunk load: ${chunkName} took ${loadTime}ms`);
    }
  }

  private static estimateChunkSize(modules: string[]): number {
    // Rough estimation based on module count and names
    return modules.reduce((total, module) => {
      if (module.includes('node_modules')) return total + 50; // External deps
      if (module.includes('.tsx') || module.includes('.jsx')) return total + 30;
      if (module.includes('.ts') || module.includes('.js')) return total + 20;
      return total + 10;
    }, 0);
  }

  static getChunkInfo(): BundleInfo[] {
    return Array.from(this.chunks.values());
  }

  static identifyUnusedChunks(): string[] {
    const allChunks = this.getChunkInfo();
    const unusedChunks = allChunks.filter(chunk => 
      chunk.loadTime === undefined || chunk.loadTime === 0
    );
    
    return unusedChunks.map(chunk => chunk.chunkName);
  }

  static getBundleReport(): {
    totalSize: number;
    largestChunks: BundleInfo[];
    slowestChunks: BundleInfo[];
    unusedChunks: string[];
  } {
    const chunks = this.getChunkInfo();
    
    return {
      totalSize: chunks.reduce((total, chunk) => total + chunk.size, 0),
      largestChunks: chunks.sort((a, b) => b.size - a.size).slice(0, 5),
      slowestChunks: chunks
        .filter(chunk => chunk.loadTime !== undefined)
        .sort((a, b) => (b.loadTime || 0) - (a.loadTime || 0))
        .slice(0, 5),
      unusedChunks: this.identifyUnusedChunks()
    };
  }
}

// Tree shaking helpers
export function markModuleAsUsed(moduleName: string) {
  if (typeof window !== 'undefined') {
    (window as any).__usedModules = (window as any).__usedModules || new Set();
    (window as any).__usedModules.add(moduleName);
  }
}

export function getUnusedModules(): string[] {
  if (typeof window === 'undefined') return [];
  
  const usedModules = (window as any).__usedModules || new Set();
  const allModules = (window as any).__allModules || new Set();
  
  return Array.from(allModules).filter(module => !usedModules.has(module));
}
