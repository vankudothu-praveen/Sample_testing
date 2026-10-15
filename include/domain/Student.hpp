#pragma once

#include "domain/EnrollmentStatus.hpp"

#include <cstdint>
#include <string>
#include <utility>

namespace studentrecords {

class Student {
public:
    Student(std::string id, std::string firstName, std::string lastName,
            std::string email, std::string course, std::uint16_t year,
            EnrollmentStatus status)
        : studentId_(std::move(id)), firstName_(std::move(firstName)),
          lastName_(std::move(lastName)), email_(std::move(email)),
          course_(std::move(course)), yearOfStudy_(year), status_(status) {}

    [[nodiscard]] const std::string& studentId() const noexcept { return studentId_; }
    [[nodiscard]] const std::string& firstName() const noexcept { return firstName_; }
    [[nodiscard]] const std::string& lastName() const noexcept { return lastName_; }
    [[nodiscard]] const std::string& email() const noexcept { return email_; }
    [[nodiscard]] const std::string& course() const noexcept { return course_; }
    [[nodiscard]] std::uint16_t yearOfStudy() const noexcept { return yearOfStudy_; }
    [[nodiscard]] EnrollmentStatus status() const noexcept { return status_; }

private:
    std::string studentId_;
    std::string firstName_;
    std::string lastName_;
    std::string email_;
    std::string course_;
    std::uint16_t yearOfStudy_;
    EnrollmentStatus status_;
};

} // namespace studentrecords
