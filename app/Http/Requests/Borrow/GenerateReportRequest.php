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
            $formattedDates['start_date'] = Carbon::createFromFormat('d-m-Y', $startDate)->format('Y-m-d');
        }

        if ($endDate) {
            $formattedDates['end_date'] = Carbon::createFromFormat('d-m-Y', $endDate)->format('Y-m-d');
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
