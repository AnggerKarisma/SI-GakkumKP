<?php

namespace App\Http\Requests\Borrow;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class GenerateReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $startDate = $this->input('start_date');
        $endDate = $this->input('end_date');
        
        $formattedDates = [];

        if ($startDate) {
            try {
                // Try multiple formats
                $parsed = Carbon::createFromFormat('Y-m-d', $startDate) 
                    ?: Carbon::createFromFormat('d-m-Y', $startDate)
                    ?: Carbon::createFromFormat('m-d-Y', $startDate);
                $formattedDates['start_date'] = $parsed->format('Y-m-d');
            } catch (\Exception $e) {
                $formattedDates['start_date'] = $startDate;
            }
        }

        if ($endDate) {
            try {
                // Try multiple formats
                $parsed = Carbon::createFromFormat('Y-m-d', $endDate)
                    ?: Carbon::createFromFormat('d-m-Y', $endDate)
                    ?: Carbon::createFromFormat('m-d-Y', $endDate);
                $formattedDates['end_date'] = $parsed->format('Y-m-d');
            } catch (\Exception $e) {
                $formattedDates['end_date'] = $endDate;
            }
        }
        $this->merge($formattedDates);
    }

    public function rules(): array
    {
        return [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'nullable|string|in:all,active,overdue,completed',
        ];
    }
}
