import fs from 'fs'
import path from 'path'

// Function to search for potential API keys in files
function searchForKeys(directory) {
  const results = []
  const keyPattern = /[A-Za-z0-9_-]{40,}/g // Pattern to match long strings that might be keys
  
  function searchDirectory(dir) {
    const files = fs.readdirSync(dir)
    
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        // Skip node_modules and .git directories
        if (file !== 'node_modules' && file !== '.git') {
          searchDirectory(filePath)
        }
      } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx'))) {
        try {
          const content = fs.readFileSync(filePath, 'utf8')
          let match
          while ((match = keyPattern.exec(content)) !== null) {
            // Filter out some common false positives
            const key = match[0]
            if (!key.includes(' ') && !key.includes('\n') && !key.includes('\r')) {
              results.push({
                file: filePath,
                line: content.substring(0, match.index).split('\n').length,
                key: key.substring(0, 20) + '...' // Truncate for display
              })
            }
          }
        } catch (error) {
          console.error(`Error reading file ${filePath}:`, error.message)
        }
      }
    })
  }
  
  searchDirectory(directory)
  return results
}

// Run the search
console.log('Searching for potential hardcoded keys...')
const results = searchForKeys('.')

if (results.length > 0) {
  console.log('\nPotential hardcoded keys found:')
  console.log('=====================================')
  results.forEach(result => {
    console.log(`File: ${result.file}`)
    console.log(`  Line: ${result.line}`)
    console.log(`  Key: ${result.key}`)
    console.log('')
  })
  
  console.log('Please review these files and replace hardcoded keys with environment variables.')
} else {
  console.log('No potential hardcoded keys found.')
}

console.log('\nNote: This is not an exhaustive search. Please manually review your codebase for any hardcoded credentials.')