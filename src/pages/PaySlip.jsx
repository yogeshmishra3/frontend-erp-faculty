import { useState } from 'react';

export default function ProfessionalPaySlip() {
  return (
    <div className="bg-gray-50 p-2 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 text-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">PAY SLIP</h1>
            <p className="text-blue-100">May 2025</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="bg-white text-blue-700 px-3 sm:px-4 py-2 rounded font-medium flex items-center gap-1 hover:bg-blue-50 transition-colors text-sm sm:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button className="bg-blue-900 text-white px-3 sm:px-4 py-2 rounded font-medium flex items-center gap-1 hover:bg-blue-800 transition-colors text-sm sm:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
        
        {/* Generated Date */}
        <div className="border-b border-gray-200 px-4 sm:px-6 py-3 text-right text-sm text-gray-500">
          Generated on: 5/6/2025
        </div>
        
        {/* Employee and Bank Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 pb-2 border-b border-gray-200">Employee Details</h2>
            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">Dr. John Smith</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Employee ID:</span>
                <span className="font-medium">FAC-1234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium">Computer Science</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Designation:</span>
                <span className="font-medium">Associate Professor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pay Period:</span>
                <span className="font-medium">May 2025</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 pb-2 border-b border-gray-200">Bank Details</h2>
            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Name:</span>
                <span className="font-medium">State Bank of India</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-medium">XXXX XXXX 1234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IFSC Code:</span>
                <span className="font-medium">SBIN0001234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PAN:</span>
                <span className="font-medium">ABCDE1234F</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Earnings and Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 pt-0">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Earnings</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Basic Salary</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right">₹85,000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Dearness Allowance</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right">₹15,000</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">House Rent Allowance</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right">₹8,500</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Transport Allowance</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right">₹3,500</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Academic Allowance</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right">₹5,000</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-900">Total Earnings</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-900 text-right">₹117,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Deductions</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Income Tax</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right">₹8,200</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Provident Fund</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right">₹7,500</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Health Insurance</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right">₹2,500</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Professional Tax</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right">₹200</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-900">Total Deductions</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-900 text-right">₹18,400</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Net Pay */}
        <div className="bg-blue-700 text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">Net Pay</h2>
          <div className="text-xl sm:text-2xl font-bold">₹98,600</div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 text-center text-xs sm:text-sm text-gray-500 border-t border-gray-200">
          This is a computer-generated pay slip and does not require signature.
        </div>
      </div>
    </div>
  );
}