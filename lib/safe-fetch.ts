/**
 * Safe fetch wrapper that handles common null reference errors
 */
export async function safeFetch(url: string, options?: RequestInit): Promise<Response> {
  try {
    // Ensure URL is valid
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided to safeFetch');
    }

    // Default options with proper headers
    const safeOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    const response = await fetch(url, safeOptions);
    
    // Return response even if not ok - let the caller handle status
    return response;
  } catch (error) {
    console.error('Safe fetch error:', error);
    // Return a mock response for error cases
    return new Response(
      JSON.stringify({ 
        error: 'Network error occurred',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        statusText: 'Internal Server Error',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Safe header getter that handles null headers
 */
export function safeGetHeader(headers: Headers | null, name: string): string | null {
  try {
    return headers?.get(name) || null;
  } catch (error) {
    console.error('Error getting header:', name, error);
    return null;
  }
}

/**
 * Safe cookie getter that handles null cookies
 */
export function safeGetCookie(cookies: any, name: string): string | null {
  try {
    return cookies?.get(name)?.value || null;
  } catch (error) {
    console.error('Error getting cookie:', name, error);
    return null;
  }
}

/**
 * Safe searchParams getter
 */
export function safeGetSearchParam(searchParams: URLSearchParams | null, name: string): string | null {
  try {
    return searchParams?.get(name) || null;
  } catch (error) {
    console.error('Error getting search param:', name, error);
    return null;
  }
}