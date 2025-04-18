/**
 * Copyright (c) 2014 - 2025 OVH SAS
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Except as contained in this notice, the name of OVH and or its trademarks
 * shall not be used in advertising or otherwise to promote the sale, use or
 * other dealings in this Software without prior written authorization from OVH.
 */

/**
  * Preconfigured API endpoints
  *
  * ovh-eu: OVH Europe
  * ovh-us: OVH US
  * ovh-ca: OVH North America
  * sys-eu: SoYouStart Europe
  * sys-ca: SoYouStart North America
  * ks-eu: Kimsufi Europe
  * ks-ca: Kimsufi North America
  */
module.exports = {
  'ovh-eu': {
    'host': 'eu.api.ovh.com',
    'tokenURL': 'https://www.ovh.com/auth/'
  },
  'ovh-us': {
    'host': 'api.us.ovhcloud.com',
    'tokenURL': 'https://us.ovhcloud.com/auth/'
  },
  'ovh-ca': {
    'host': 'ca.api.ovh.com',
    'tokenURL': 'https://ca.ovh.com/auth/'
  },
  'sys-eu': {
    'host': 'eu.api.soyoustart.com'
  },
  'sys-ca': {
    'host': 'ca.api.soyoustart.com'
  },
  'soyoustart-eu': {
    'host': 'eu.api.soyoustart.com'
  },
  'soyoustart-ca': {
    'host': 'ca.api.soyoustart.com'
  },
  'ks-eu': {
    'host': 'eu.api.kimsufi.com'
  },
  'ks-ca': {
    'host': 'ca.api.kimsufi.com'
  },
  'kimsufi-eu': {
    'host': 'eu.api.kimsufi.com'
  },
  'kimsufi-ca': {
    'host': 'ca.api.kimsufi.com'
  },
};
