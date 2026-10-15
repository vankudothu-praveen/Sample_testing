#pragma once

#include <optional>
#include <string_view>

namespace studentrecords {

enum class EnrollmentStatus { Active, Inactive, Suspended, Graduated };

[[nodiscard]] constexpr std::string_view toString(EnrollmentStatus status) noexcept {
    switch (status) {
        case EnrollmentStatus::Active: return "Active";
        case EnrollmentStatus::Inactive: return "Inactive";
        case EnrollmentStatus::Suspended: return "Suspended";
        case EnrollmentStatus::Graduated: return "Graduated";
    }
    return "Unknown";
}

[[nodiscard]] inline std::optional<EnrollmentStatus> enrollmentStatusFromString(std::string_view value) {
    if (value == "active" || value == "Active") return EnrollmentStatus::Active;
    if (value == "inactive" || value == "Inactive") return EnrollmentStatus::Inactive;
    if (value == "suspended" || value == "Suspended") return EnrollmentStatus::Suspended;
    if (value == "graduated" || value == "Graduated") return EnrollmentStatus::Graduated;
    return std::nullopt;
}

} // namespace studentrecords
